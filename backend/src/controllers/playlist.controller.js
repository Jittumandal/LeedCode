
import { db } from "../libs/db.js";
const createPlaylist = async (req, res) => {

    try {
        // get name and description from the request body
        const { name, description } = req.body;

        // get userId from the request
        const userId = req.user.id;
        // console.log('getting user id', userId)

        // check if the playlist already exists
        const existingPlaylist = await db.Playlist.create({
            data: {
                name: name,
                description: description,
                userId: userId

            }
        });

        // if the playlist already exists, return an error
        if (!existingPlaylist) {
            return res.status(400).json({ message: "Playlist already exists" });
        }

        // sednd the response
        return res.status(200).json({
            sucuss: true,
            message: "Playlist created successfully",
            existingPlaylist
        });

    } catch (error) {
        console.log('failed to create playlist', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    }
}

const getAllListDetails = async (req, res) => {
    try {

        // get all the playlists from the database
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });

        // check if there are no playlists

        if (!playlists) {
            return res.status(401).json({
                message: 'No playlists found'
            })
        }


        // send response

        res.status(200).json({
            success: true,
            message: 'Playlists fetched successfully',
            playlists
        })

    } catch (error) {
        console.log("Error fetching playlists:", error);
        res.status(500).json({
            error: "Error fetching playlists",
        });

    }


}


const getPlayListDetails = async (req, res) => {
    // get the playlist id from the request params
    const { playlistId } = req.params;

    try {
        // get the playlist details from the database
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id,

            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });

        // check if the playlist exists
        if (!playlist) {
            return res.status(401).json({
                message: 'Playlist not found'
            })
        }

        // send response
        res.status(200).json({
            success: true,
            message: 'Playlist fetched successfully',
            playlist
        })


    } catch (error) {
        console.log("Error fetching playlist details:", error);
        res.status(500).json({
            error: "Error fetching playlist details",
        });

    }
}


const addProblemToPlaylist = async (req, res) => {
    // get the playlist id and problem id from the request body
    const { playlistId } = req.params;
    // get the problem ids from the request body
    const { problemIds } = req.body;

    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemsId" });
        }

        // create a new playlist with the given name and description
        // Create records fro each problems in the playlist
        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId,
            })),
        });

        // check if the problems were added successfully
        if (!problemsInPlaylist) {
            return res.status(400).json({ message: "Problems not added to playlist" });
        }
        // send response
        res.status(200).json({
            success: true,
            message: "Problems added to playlist successfully",
            problemsInPlaylist
        });


    } catch (error) {
        console.log("Error adding problem to playlist:", error);
        res.status(500).json({
            error: "Error adding problem to playlist",
        });

    }
}


const deletePlaylist = async (req, res) => {
    // get the playlist id from the request params
    const { playlistId } = req.params;
    try {
        // delete the playlist from the database
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
                userId: req.user.id,
            },
        });

        // check if the playlist was deleted successfully
        if (!deletedPlaylist) {
            return res.status(400).json({ message: "Playlist not deleted" });
        }

        // send response
        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedPlaylist
        });

    } catch (error) {
        console.log("Error deleting playlist:", error);
        res.status(500).json({
            error: "Error deleting playlist",
        });

    }

}

const removeProblemFromPlaylist = async (req, res) => {
    // get the playlist id and problem id from the request body
    const { playlistId } = req.params;
    const { problemId } = req.body;

    try {
        // check array of problemId
        if (!Array.isArray(problemId) || problemId.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemId" });
        }
        // delete the problem from the playlist
        const deletedProblem = await db.problemsInPlaylist.deleteMany({
            where: {
                playlistId: playlistId,
                problemId: {
                    in: problemId,
                },
            },
        });


        // check if the problem was deleted successfully
        if (!deletedProblem) {
            return res.status(400).json({ message: "Problem not deleted from playlist" });
        }
        // send response
        res.status(200).json({
            success: true,
            message: "Problem deleted from playlist successfully",
            deletedProblem
        });


    } catch (error) {
        console.log("Error removing problem from playlist:", error);
        res.status(500).json({
            error: "Error removing problem from playlist",
        });


    }


}



export { createPlaylist, getAllListDetails, getPlayListDetails, addProblemToPlaylist, deletePlaylist, removeProblemFromPlaylist }