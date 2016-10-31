import React, { Component } from 'react';
import './App.css';

class GuessKitty extends Component {

    constructor(props) {
        super(props)

        this.state = {
            NUMBER_OF_BLOCKS: 25
            , blocks: []
            , KITTY_INDEX: Math.floor((Math.random() * 10) + 1)
            , win : false
            , attempts: 0
            , currentScore: 0
            , scores : []
        };

        for (var i = 0; i < this.state.NUMBER_OF_BLOCKS; i++) {
            var content = (i === this.state.KITTY_INDEX) ? 'KITTY' : 'X';
            this.state.blocks.push(content);
        }
    }

    getScoreUpdate() {
        var length = this.state.scores.length;
        var scores = this.state.scores;
        if (length > 0) {
            this.totalScore = scores.reduce(function(next, prev) {
                return next + prev;
            });

            this.avgScore = Math.round(this.totalScore / length);
            this.minScore = scores.reduce(function(a,b) { return (a < b) ? a : b });
            this.maxScore = scores.reduce(function(a,b) { return (a > b) ? a : b });
        }
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

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Guess Kitty - ReactJs</h1>
                </div>
                <center>
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
                    </div>
                </center>
            </div>
        );
    }
}

export default GuessKitty;
