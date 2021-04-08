import React from 'react';
import './App.css';
import cn from 'classnames'


const sound1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
const sound2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
const sound3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
const sound4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
const soundBoard = [sound1, sound2, sound3, sound4];



const CirclePart  = ({circleStyle, individualStyle, id, clicked, animate}) => {
  const handleClicked = () => {
    clicked(id)
  }

  return(
      <>
        <div onClick={handleClicked} className={cn(circleStyle, individualStyle, {'animated': animate})} />
      </>
  )
}


const ControlPanel = ({handleStart, round, disable}) => {
    const [levelArr, setLevelArr] = React.useState([true, false, false])

    // switch choosen level
    const handleLevel = (id) => {
        if(id === 0){
            setLevelArr([true, false, false])
        }
        if(id === 1){
            setLevelArr([false, true, false])
        }
        if(id === 2){
            setLevelArr([false, false, true])
        }
    }

    // set clicked btn and return choosen level
    const startGame = React.useCallback(
        () => {
            handleStart(levelArr)
        },
        [levelArr],
    )


  return (
      <>
        <div className='control-panel'>
            <h1>Simon Game</h1>
          <p>Round: {round}</p>
          <button disabled={disable} onClick={startGame}>START</button>

          <p>Game Options: </p>
          <div className="game-options">
            <div>
                <input
                    type="checkbox"
                    checked={levelArr[0]}
                    onChange={() => handleLevel(0)}
                    name="option2"
                    value="a2" />Easy
            </div>
            <div>
                <input
                    type="checkbox"
                    checked={levelArr[1]}
                    onChange={() => handleLevel(1)}
                    name="option2"
                    value="a2" />Normal
            </div>
            <div>
                <input
                    type="checkbox"
                    checked={levelArr[2]}
                    onChange={() => handleLevel(2)}
                    name="option2"
                    value="a2" />Hard
            </div>
          </div>

        </div>
      </>
  )
}




const App = () => {
    const [animate, setAnimate] = React.useState([false, false, false, false]); //to animate color with unique id
    const [computerSeries, setComputerSeries] = React.useState([]) // array of computer random series
    const [humanSeries, setHumanSeries] = React.useState([]) // array of human series of moves
    const [round, setRound] = React.useState(0) // amount of rounds
    const [levelArr, setLevelArr] = React.useState([true, false, false]) // choosen level

    // if button start pressed
    const handleStart = (levelArr) => {
        getSequences() // get a random num and play it
        setLevelArr(levelArr) // set play level
    }

    console.log(levelArr)
    console.log(computerSeries)
    console.log(humanSeries)


    const getSequences = () => {
        let randomNum = Math.floor(Math.random() * (4))
        setComputerSeries(prevState => [...prevState, randomNum]) // set rand num to series
    };


    // if human clicked a color
    const handleClicked = (id) => {
        soundBoard[id].playbackRate = levelArr[0] ? 0.8 : levelArr[1] ? 0.9 : 1.5;
        soundBoard[id].play();

        // animate choosen circle
        setAnimate(prevState => {
            const newState = [...prevState]
            newState[id] = true
            return newState
        })

        // set click to player array of clicked circles
        setHumanSeries(prevState => [...prevState, id])

        setTimeout(function(){  setAnimate(prevState => {
            const newState = [...prevState]
            newState[id] = false
            return newState
        })
        }, levelArr[2] ? 350 : 400);
    }


    React.useEffect(() => {
        if(computerSeries.length !== 0){
            setTimeout(function () {
                for (let i = 0; i < computerSeries.length; i++) { // play all circles in a queue
                    setTimeout(function () {
                        soundBoard[computerSeries[i]].playbackRate = levelArr[0] ? 0.8 : levelArr[1] ? 0.9 : 1.5;
                        soundBoard[computerSeries[i]].play();
                        setAnimate(prevState => {
                            const newState = [...prevState]
                            newState[computerSeries[i]] = true
                            return newState
                        });
                    }, levelArr[0] ? 1000 * (i + 1) + 500 * i : levelArr[1] ? 500 * (i + 1) + 500 * i : 350 * (i + 1) + 50 * i);
                    setTimeout(function () {
                        setAnimate(prevState => {
                            const newState = [...prevState]
                            newState[computerSeries[i]] = false
                            return newState
                        })
                    }, levelArr[0] ? 1000 * (i + 2) + 500 * i : levelArr[1] ? 500 * (i + 2) + 500 * i : 350 * (i + 2) + 50 * i);
                }
            }, levelArr[0] ? 0 : levelArr[1] ? 1000 : 500);
        }},
        [computerSeries]
    )


    React.useEffect(() => {

        if(humanSeries.length !== 0){
            // set new round if player won
            if(humanSeries.length === computerSeries.length){
                setRound(round+1)
                setHumanSeries([])
                getSequences()

            }

            // restart game if player lost
            if(computerSeries[humanSeries.length - 1] !== humanSeries[humanSeries.length - 1]){
                setRound(0)
                setComputerSeries([])
                setHumanSeries([])
            }
        }
        },
        [humanSeries]
    )


    return (
      <div className="App">
        <div className="circle-wrap">
          <CirclePart
              key={0}
              id={0}
              circleStyle={'circle-part'}
              individualStyle={'circle-one'}
              clicked={handleClicked}
              animate={animate[0]}
          />
          <CirclePart
              key={1}
              id={1}
              circleStyle={'circle-part'}
              individualStyle={'circle-two'}
              clicked={handleClicked}
              animate={animate[1]}
          />
          <CirclePart
              key={2}
              id={2}
              circleStyle={'circle-part'}
              individualStyle={'circle-three'}
              clicked={handleClicked}
              animate={animate[2]}
          />
          <CirclePart
              key={3}
              id={3}
              circleStyle={'circle-part'}
              individualStyle={'circle-four'}
              clicked={handleClicked}
              animate={animate[3]}
          />
        </div>
          <ControlPanel
              disable={computerSeries.length !== 0}
              handleStart={handleStart}
              round={round}
          />
      </div>
  );
}

export default App;
