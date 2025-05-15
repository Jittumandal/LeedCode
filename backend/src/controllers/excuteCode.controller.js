import { json } from "express";
import { db } from "../libs/db.js";
import { submitBatch, pollBatchResults, getLanguageName } from "../libs/judge0.libs.js";

const excuteCode = async (req, res) => {
    // get the data code from the request body
    const { source_code, language_id, stdin, excepected_output, problemId } = req.body;

    // get user id  from  the request user token
    const userId = req.user.id;

    try {

        // validate test case 
        if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(excepected_output) || excepected_output.length !== stdin.length) {
            return res.status(401).json({
                success: true,
                message: 'Invalid test case'
            })
            console.log('valid test case')
        }

        // parpare all test case for judge0 batch submission
        const submission = stdin.map((input, index) => ({
            source_code,
            language_id,
            stdin: input,
            base64_encoded: false,
            wait: false
        }))

        // send batch data for submission to judge0 
        const submitResposne = await submitBatch(submission)

        // aceess token from the response r for response
        const tokens = submitResposne.map((r) => r.token);
        // get pullbatch result from judge0 all submission test cases 
        const results = await pollBatchResults(tokens);

        // check by console.log(results)
        console.log('Show the results', results)

        // yeha per result ko analize hogra toh kon kon test case per fail hogi 

        let allPassed = true;

        const detailsResults = results.map((result, index) => {
            const stdout = result.stdout?.trim() || "No Output"; // Trim output, handle empty cases
            const expectedOutput = excepected_output[index]?.trim() || "No Expected Output"; // Handle empty cases
            const passed = stdout === expectedOutput; // Check output equality

            if (!passed) {
                allPassed = false;
                console.error(`❌  Test case  ${index + 1} failed!`);
                console.log(`Input for testcase #${index + 1}: ${stdin[index]}`)
                console.error(`Expected output the test case: "${expectedOutput}"`);
                console.error(`Actual output the test case  : "${stdout}"`);
            } else {
                console.log(`✅ Test case ${index + 1} passed!`);
            }

            return {
                testCase: index + 1, // Start from 1
                passed, // Check output equality
                stdout, // Trim output
                expected: expectedOutput, // Handle empty cases expected output
                stderr: result.stderr || null, // Handle empty cases stderr 
                compile_output: result.compile_output || null, // Handle empty cases compile output
                status: result.status?.description || "Unknown", //     Handle empty cases status
                memory: result.memory ? `${result.memory} KB` : "Not Available", //     Handle empty cases memory
                time: result.time ? `${result.time} s` : "Not Available", //     Handle empty cases time
            };
        });

        console.log(detailsResults)
        console.log('test error', getLanguageName(language_id))


        // store submission summary
        const submissionSummary = await db.submission.create({
            data: {
                userId,
                problemId: problemId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailsResults.map((r) => r.stdout)),
                stderr: detailsResults.some((r) => r.stderr)
                    ? JSON.stringify(detailsResults.map((r) => r.stderr))
                    : null,
                compileOutput: detailsResults.some((r) => r.compile_output)
                    ? JSON.stringify(detailsResults.map((r) => r.compile_output))
                    : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memory: detailsResults.some((r) => r.memory)
                    ? JSON.stringify(detailsResults.map((r) => r.memory))
                    : null,
                time: detailsResults.some((r) => r.time)
                    ? JSON.stringify(detailsResults.map((r) => r.time))
                    : null,
            },
        });

        console.log("show data submissionSummary", submissionSummary)
        // If All passed = true mark problem as solved for the current user
        if (allPassed) {
            await db.problemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId,
                        problemId,
                    },
                },
                update: {},
                create: {
                    userId,
                    problemId,
                },
            });
        }
        // 8. Save individual test case results  using detailedResult

        const testCaseResults = detailsResults.map((result) => ({
            submissionId: submissionSummary.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time: result.time,
        }));

        await db.testCaseResult.createMany({
            data: testCaseResults,
        });

        const submissionWithTestCase = await db.submission.findUnique({
            where: {
                id: submissionSummary.id,
            },
            include: {
                testCases: true,
            },
        });


        // Send response
        res.status(200).json({
            success: true,
            message: "Code executed successfully",
            submissionSummary: submissionWithTestCase,
        });

    } catch (error) {
        console.log("Error excuting code:", error);
        res.status(500).json({
            error: "Error excuting code",
        });

    }
}

export default excuteCode
