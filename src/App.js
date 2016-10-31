import React, { Component } from 'react';
import './App.css';


class GuessKitty extends Component {

    constructor(props) {
        super(props)

        var scores = [];

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
            , KITTY_INDEX: Math.floor((Math.random() * 10) + 1)
            , win : false
            , attempts: 0
            , currentScore: 0
            , scores : scores
            , startGame: false
        };

        for (var i = 0; i < this.state.NUMBER_OF_BLOCKS; i++) {
            var content = (i === this.state.KITTY_INDEX) ? 'KITTY' : 'X';
            this.state.blocks.push(content);
        }
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
        var scores = this.state.scores;
        this.calculateScoreSummary(scores);
    }

    handleClick(index) {
        var blocks =  this.state.blocks;
        var scores = this.state.scores;
        if (this.state.blocks[index] !== 'VISITED') {
            blocks[index] = 'VISITED';
            if (index === this.state.KITTY_INDEX) {
                var currentScore = (25-this.state.attempts)*100;
                scores.push(currentScore);
            }
            this.state.attempts++;
            this.setState({
                blocks: blocks
                , attempts: this.state.attempts
                , win: (index === this.state.KITTY_INDEX)
                , currentScore : currentScore
                , scores: scores
            });

            localStorage.setItem('scores', scores);
            this.getScoreUpdate();
        }

    }

    handleClickRestart() {
        var state = this.state;
        state.NUMBER_OF_BLOCKS =  25;
        state.blocks = [];
        state.KITTY_INDEX = Math.floor((Math.random() * 10) + 1);
        state.win = false;
        state.attempts = 0;
        state.currentScore = 0;

        for (var i = 0; i < state.NUMBER_OF_BLOCKS; i++) {
            var content = (i === state.KITTY_INDEX) ? 'KITTY' : 'X';
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
        })
    }

    render() {
        return (
            <div className="App">
                <center>
                    <div className="App-header">
                        <h1>Guess Kitty - ReactJs</h1>
                    </div>
                    <div className="game-area">
                        <div className={"board " + (this.state.win ? "board won": "")}>
                            {this.state.blocks.map((block, index) => {
                                return  (block === 'VISITED')
                                    ? (index === this.state.KITTY_INDEX)
                                    ? <div onClick={() => this.handleClick(index)} className="block success"><i className="fa fa-smile-o"></i></div>
                                    : <div onClick={() => this.handleClick(index)} className="block failed"><i className="fa fa-frown-o"></i></div>
                                    : <div onClick={() => this.handleClick(index)} className="block"><span className="fa fa-lock"></span></div>;
                            })}
                        </div>
                        <div className={"score " + (this.state.win ? "Winner-anim": "")}>
                            <p>Kitty Found</p>
                            <h3> SCORE = {this.state.currentScore} </h3>
                            <br></br>
                            <a href="javascript:;" onClick={() => this.handleClickRestart()} className="noDecoration">RESTART</a>
                        </div>
                    </div>
                    <h3> ATTEMPTS = {this.state.attempts}/25 </h3>
                    <div className={this.state.scores.length > 0 ? "scores": "scores hide-me"}>
                        <h3>Scores</h3>
                        <div className="score-list">
                            <hr></hr>
                            {this.state.scores.map((score, index) => {
                                return <p><b>{index+1}.</b> {score}</p>
                            })}
                        </div>
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
                        <p>
                            <a href="javascript:;" onClick={() => this.clearScores()} className="clear-scores">Clear scores <i className="fa fa-trash"></i></a>
                        </p>
                    </div>
                </center>
                <div className={this.state.startGame || this.state.scores.length > 0 ? "wrapper hide-me" : "wrapper"}>
                    <div className="wrapper-content">
                        <center>
                            <br/><br/>
                            <span className="wrapper-title">
									Guess Kitty
								</span>
                            <br/><br/><br/>
                            <div className="intro-data" onClick={() => this.startGame()} >
                                <img src="assets/img/guess-kitty-one.png" className="screenshots"/>
                                <img src="assets/img/guess-kitty-two.png" className="screenshots"/>
                                <img src="assets/img/guess-kitty-three.png" className="screenshots"/>
                            </div>
                            <br/><br/><br/><br/>
                            <a href="javascript:;" onClick={() => this.startGame()} className="start-game"><span>Start</span> <i className="fa fa-play-circle-o start-button"></i></a>
                            <br/><br/><br/><br/>
                        </center>
                    </div>
                </div>
            </div>
        );
    }
}

export default GuessKitty;
