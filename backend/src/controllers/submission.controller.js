import { db } from "../libs/db.js"

const getAllSubmissions = async (req, res) => {
    try {
        // get userid  from the request params
        const userId = req.user.id

        // submission model
        const submission = await db.submission.findMany({
            where: {
                userId: userId
            }
        })

        // send the response
        res.status(200).json({
            success: true,
            message: 'Submissions fetched successfully',
            submission
        })

    } catch (error) {
        console.log("Error fetching submissions:", error);
        res.status(500).json({
            error: "Error fetching submissions",
        });

    }

}

const getSubmissionsForProblem = async (req, res) => {
    try {
        // get userid from the request params
        const userId = req.user.id

        // get problemid from the request params
        const problemId = req.params.problemId

        // submission model
        const submission = await db.submission.findMany({
            where: {
                userId: userId,
                problemId: problemId
            }
        })
        ///send the response
        res.status(200).json({
            success: true,
            message: 'Submissions fetched successfully',
            submission
        })
    } catch (error) {
        console.log("Error fetching submissions:", error);
        res.status(500).json({
            error: "Error fetching submissions",
        });

    }

}

const getAllTheSubmissionForProblem = async (req, res) => {
    try {
        // get problemid from the request params
        const problemId = req.params.problemId

        // submission model
        const submission = await db.submission.count({
            where: {
                problemId: problemId
            }
        })
        ///send the response
        res.status(200).json({
            success: true,
            message: 'Submissions count fetched successfully',
            count: submission
        })

    } catch (error) {
        console.log("Error fetching to count submissions:", error);
        res.status(500).json({
            error: "Error fetching to count submissions",
        });

    }

}

export { getAllSubmissions, getSubmissionsForProblem, getAllTheSubmissionForProblem }