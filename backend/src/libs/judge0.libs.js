import axios from 'axios'

const getJudge0LanguageId = (language) => {
    // Map of language to its id
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }

    return languageMap[language.toupperCase()] // Convert the language to uppercase and return the id
}
const submitBatch = async (submission) => {
    // Code for submitting multiple solutions at once
    const data = await axix.post(`${proccess.env.JUDGE0_API_URL}/submissions/batch, submission / batch ? base64_encoded = false`, {
        submission
    })
    console.log('get submission result', data)

    return data;
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
        console.log('get submission result', data)

        // check if all the results are done
        const results = data.submissions;

        // check if all the results are done
        const isAllDone = results.every(
            (result) => result.status.id !== 1 && result.status.id !== 2
        )
        // check if all the results are done 
        if (isAllDone) return results
        await sleep(1000) // wait for 1 second
    }
}


export { getJudge0LanguageId, submitBatch, pollBatchResults }