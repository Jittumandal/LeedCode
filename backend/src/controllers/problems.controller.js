import { db } from "../libs/db.js"
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../libs/judge0.libs.js"


const createProblem = async (req, res) => {
    // get the data from the request body
    const { title, description, constraints, difficulty, tags, userId, examples, hints, editorial, testcases, codeSnippets, referenceSolutions } = req.body

    // check the user role and admin
    if (req.user.role !== 'ADMIN') {
        return res.status(401).json({
            message: 'You are not authorized to create a problems'
        })
    }

    try {
        // create the for loop
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            // check if the language is supported
            if (!languageId) {
                return res.status(401).json({ message: ` Language ${language} is not supported ` })
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
            const tokens = submissionResult.map((res) => res.token)

            // get the pollBatchResults results from the judge0.libs.js file
            const results = await pollBatchResults(tokens)

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log("Result-----", result);
                // console.log(
                //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
                // );
                if (result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`,
                    });
                }

            } // close the second for loop


        } // close the for loop

        // create the problem in the database
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
            }
        })

        // send response
        res.status(201).json({
            success: true,
            message: 'Problem created successfully',
            problem: newProblem
        })

    } catch (error) {
        console.error("Error creating problem:", error);
        res.status(500).json({
            error: "Error creating problem",
        });

    }


}


const getAllProblems = async (req, res) => {
    try {
        // get all the problems from the database
        const problems = await db.problem.findMany()

        // check if there are no problems
        if (!problems) {
            return res.status(401).json({
                message: 'No problems found'
            })
        }
        // send response
        res.status(200).json({
            success: true,
            message: 'Problems fetched successfully',
            problems
        })
    } catch (error) {
        console.log("Error fetching problems:", error);
        res.status(500).json({
            error: "Error fetching problems",
        });
    }

}

const getProblembyId = async (req, res) => {
    // get the problem id from the request params
    const { id } = req.params;

    try {
        // find probles for findUnique kiy kyu kis sabh problesm ka unique id ho ga
        const problem = await db.problem.findUnique({
            where: {
                id
            }
        })

        // validate the probles
        if (!problem) {
            return res.status(404).json({
                message: 'No is not problem found'
            })
        }
        // send response by people who are lagged
        res.status(200).json({
            success: true,
            message: 'Problem fetched successfully',
            problem
        })

    } catch (error) {
        console.log("Error fetching problem:", error);
        res.status(500).json({
            error: "Error fetching problem",
        });

    }
}

const updateProblem = async (req, res) => { }


const deleteProblem = async (req, res) => {

    // get the problem id from the request params
    const { id } = req.params;

    try {
        // find probles for findUnique kiy kyu kis sabh problesm ka unique id ho ga
        const problem = await db.problem.findUnique({
            where: {
                id
            }
        })

        // validate the probles
        if (!problem) {
            return res.status(401).json({
                success: true,
                message: 'The Problems deteled successfully',
            })
        }
        // send response by people who are lagged
        res.status(200).json({
            success: true,
            message: 'Problem deleted successfully',
            problem
        })
    } catch (error) {
        console.log("Error deleting  the problem:", error);
        res.status(500).json({
            error: "Error deleting the  problem",
        });

    }



}

const getAllProblemsSolvedByUserId = async (req, res) => { }




export { createProblem, getAllProblems, getProblembyId, updateProblem, deleteProblem, getAllProblemsSolvedByUserId }