console.time("Ai move")
        console.log("Get info from TT before: " + state.countGetCash)
        console.log("Store info from TT before: " + state.countStoreCash)
        let aiMove = aiEngine.makeBestMove(state)
        console.timeEnd("Ai move")
        console.log("Get info from TT after: " + state.countGetCash)
        console.log("Store info from TT after: " + state.countStoreCash)
        state.countGetCash = 0
        state.countStoreCash = 0