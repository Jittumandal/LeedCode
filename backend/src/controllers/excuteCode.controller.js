import { submitBatch, pollBatchResults } from "../libs/judge0.libs.js";

const excuteCode = async (req, res) => {
    // get the data code from the request body
    const { source_code, language_id, stdin, excepected_output, problem_id } = req.body;

    try {
        // get user id  from  the request user token
        const userId = req.user.id;

        // validate test case 
        if (Array.isArray(stdin) || stdin.length === 0 || Array.isArray(excepected_output) || excepected_output.length !== stdin.length) {
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

        // send response 
        res.status(200).json({
            success: true,
            message: 'Code excuted successfully',
            results
        })


    } catch (error) {

    }
}

export default excuteCode
