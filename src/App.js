import React from 'react';
import ReactDOM from 'react-dom';
import Header from './common/header';
import "../assets/app.scss";
import { VISITED, MAX_BLOCKS, BLOCK_VALUE_KITTY, BLOCK_VALUE_X } from './constants';

class App extends React.Component {
    constructor(props) {
        super(props)

        let scores = [];

        if (localStorage.getItem('scores')) {
            scores = localStorage.getItem('scores').split(',');
            scores = scores.map(function(item) {
                return parseInt(item, 10);
            });
            this.calculateScoreSummary(scores);
        }

        this.state = {
            NUMBER_OF_BLOCKS: 25
            , blocks: []
            , KITTY_INDEX: Math.floor((Math.random() * 25))
            , win : false
            , attempts: 0
            , currentScore: 0
            , scores
            , startGame: false
            , showScoreboard : false
        };

        for (let i = 0; i < this.state.NUMBER_OF_BLOCKS; i++) {
            let content = (i === this.state.KITTY_INDEX) ? 'KITTY' : 'X';
            this.state.blocks.push(content);
        }
    }

    showScoreboard() {
        let {showScoreboard} = this.state;
        this.setState({
            showScoreboard : !showScoreboard
        })
    }

    calculateScoreSummary(scores) {
        if (scores.length < 1) {
            return;
        }
        this.totalScore = scores.reduce(function(next, prev) {
            return Number(next) + Number(prev);
        });

        this.avgScore = Math.round(this.totalScore / scores.length);
        this.minScore = scores.reduce(function(a,b) { return (a < b) ? a : b });
        this.maxScore = scores.reduce(function(a,b) { return (a > b) ? a : b });
    }

    getScoreUpdate() {
        let scores = this.state.scores;
        this.calculateScoreSummary(scores);
    }

    handleClick(index) {
        let {blocks, scores, win, attempts} = this.state;
        if (win) {
            return;
        }
        let currentScore = 0;
        if (blocks[index] !== VISITED) {
            blocks[index] = VISITED;
            if (index === this.state.KITTY_INDEX) {
                currentScore = (MAX_BLOCKS-this.state.attempts)*100;
                scores.push(currentScore);
                if (scores.length == 2) {
                    this.showScoreboard();
                }
            }

            let newAttempts = attempts+1;

            this.setState({
                blocks
                , attempts : newAttempts
                , win: (index === this.state.KITTY_INDEX)
                , currentScore : currentScore
                , scores: scores
            });

            localStorage.setItem('scores', scores);
            this.getScoreUpdate();
        }

    }

    handleClickRestart() {
        let state = this.state;
        state.NUMBER_OF_BLOCKS = MAX_BLOCKS;
        state.blocks = [];
        state.KITTY_INDEX = Math.floor((Math.random() * MAX_BLOCKS));
        state.win = false;
        state.attempts = 0;
        state.currentScore = 0;

        for (let i = 0; i < state.NUMBER_OF_BLOCKS; i++) {
            let content = (i === state.KITTY_INDEX) ? BLOCK_VALUE_KITTY : BLOCK_VALUE_X;
            state.blocks.push(content);
        }

        this.setState(state);
    }

    clearScores() {
        this.setState({
            scores: []
        });

        localStorage.clear();
        this.getScoreUpdate();
    }

    startGame() {
        this.setState({
            startGame: true
        }, () => {
            console.log(this.state);
        })
    }

    render() {
        let {blocks, currentScore, win, startGame, scores, showScoreboard, attempts, KITTY_INDEX} = this.state;
        let boardComponents = [];
        let scoreClass = "scores hide-me";

        if (scores.length > 0) {
            scoreClass = "scores";
            if (showScoreboard) {
                scoreClass += " show-me"
            }
        }

        blocks.map((item, idx) => {
            let content = <div onClick={() => this.handleClick(idx)} key={idx} className="block"><span className="fa fa-lock"></span></div>;
            if (item == VISITED) {
                content = <div className="block failed" key={idx}><i className="fa fa-frown-o"></i></div>;
                if (idx == KITTY_INDEX) {
                    content = <div onClick={() => this.handleClick(index)} key={idx} className="block success"><i className="fa fa-smile-o"></i></div>;
                }
            }
            boardComponents.push(content)
        })
     
        return  (
            <div className="guess-kitty">
                <Header/>
                <a href="https://github.com/krishcdbry/guess-kitty-react" className="fork-badge">
                    <img src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"/>
                </a>
                <div className="game-container">
                    <div className="board">
                        {boardComponents}
                        <div className={"score" + (win ? " winner-anim": "")}>
                            <p>Kitty Found</p>
                            <h3> SCORE = {currentScore} </h3>
                            <br></br>
                            <a href="javascript:;" onClick={() => this.handleClickRestart()} className="noDecoration btn">RESTART</a>
                        </div>
                    </div>
                    <h3 className="attempts"> ATTEMPTS = {attempts}/{MAX_BLOCKS} </h3>
                </div>
                <div className={scoreClass}>
                    <a href="javascript:;" className="show-trigger" onClick={this.showScoreboard.bind(this)}>Scores</a>
                    <h3></h3>
                    <div className="score-summary">
                        <div className="score-summary-block">
                            <b>Total</b> : {this.totalScore}
                        </div>
                        <div className="score-summary-block">
                            <b>Avg</b> :  {this.avgScore}
                        </div>
                        <div className="score-summary-block">
                            <b>Best</b> : {this.maxScore}
                        </div>
                        <div className="score-summary-block">
                            <b>Worst</b> : {this.minScore}
                        </div>
                    </div>
                    <div className="delete-data">
                        <a href="javascript:;" onClick={() => this.clearScores()} className="clear-scores">Clear scores <i className="fa fa-trash"></i></a>
                    </div>
                    <div className="score-list">
                        {scores.map((score, index) => {
                            return <p key={index}   ><b>{index+1}.</b> {score}</p>
                        })}
                    </div>
                </div>
                
                <div className={startGame || scores.length > 0 ?  "wrapper hide-me" : "wrapper"}>
                    <div className="wrapper-content">
                        
                            <div className="intro-data" onClick={() => this.startGame()} >
                                <img src="assets/img/guess-kitty.png" className="screenshots"/>
                            </div>
                        
                            <a href="javascript:;" onClick={() => this.startGame()} className="start-game"><span>Start</span> <i className="fa fa-play-circle-o start-button"></i></a>
                            
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);