import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const getJudge0LanguageId = (language) => {
    // Map of language to its id
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }

    return languageMap[language.toUpperCase()] // Convert the language to uppercase and return the id
}


// Code for polling the results
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const pollBatchResults = async (tokens) => {
    //
    while (true) {
        // get the results from judge0 
        // params get the results from 
        const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        })

        // console.log('get submission result', data)

        // check if all the results are done
        const results = data.submissions;

        // check if all the results are done
        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        )



        // check if all the results are done 
        if (isAllDone) return results
        await sleep(1000) // wait for 1 second
    }
}

const submitBatch = async (submissions) => {
    // Code for submitting multiple solutions at once
    const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions
    })


    console.log("Submission Results: ", data)

    return data // [{token} , {token} , {token}]
}

export { getJudge0LanguageId, submitBatch, pollBatchResults }