import { db } from "../libs/db.js"
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../libs/judge0.libs.js"


const createProblem = async (req, res) => {
    // get the data from the request body
    const { title, description, constraints, difficulty, tags, userId, examples, hints, editorial, testcases, codeSnippets, referenceSolutions } = req.body

    // check the user role and admin
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            message: 'You are not authorized to create a problems'
        })
    }

    try {
        // create for loop 
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            // check if the language is supported
            if (!languageId) {
                return res.status(401).json({ message: ` Language ${language} is not supported ` })
            }
        }

        // submission object 
        const submission = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
        }))

        // get the submitBatch from the judge0.libs.js file
        const submissionResult = await submitBatch(submission)

        // get the token from the submissionResult array from the judge0.libs.js file
        const token = submissionResult.map((res) => res.token)

        // get the pollBatchResults results from the judge0.libs.js file
        const result = await pollBatchResults(token)

        // get the result from the judge0.libs.js file 
        for (let i = 0; i < result.length; i++) {
            const result = result[i];
            console.log('Result....', result);

            // check if the result is correct
            if (result.status.id !== 3) {
                return res.status(401).json({ message: `Testcase ${i + 1} failed for language ${language}` })
            }
        }

        // save th problem data in the database
        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                constraints,
                difficulty,
                tags,
                userId,
                examples,
                hints,
                editorial,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id,
            },
        });
        // send the response
        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: newProblem,
        });


    } catch (error) {
        console.error("Error creating problem:", error);
        res.status(500).json({
            error: "Error creating problem",
        });

    }


}


const getAllProblems = async (req, res) => { }

const getProblembyId = async (req, res) => { }

const updateProblem = async (req, res) => { }


const deleteProblem = async (req, res) => { }

const getAllProblemsSolvedByUserId = async (req, res) => { }




export { createProblem, getAllProblems, getProblembyId, updateProblem, deleteProblem, getAllProblemsSolvedByUserId }