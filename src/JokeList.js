import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import Joke from './Joke';
import { v4 as uuidv4 } from 'uuid';

class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10,
    }

    state = {
        jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]")
    }

    componentDidMount () {
        if (this.state.jokes.length === 0) this.getJokes();
    }

    async getJokes() {
        let jokes = [];
        while(jokes.length < this.props.numJokesToGet) {
            const response = await axios.get('https://icanhazdadjoke.com/', 
                                                {headers: { Accept: "application/json" }});
            jokes.push({id: uuidv4(), text: response.data.joke, votes: 0});
        }
        this.setState(ctState => ({
             jokes: [ ...ctState.jokes, ...jokes ]
            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }

    handleClick = () => {
        this.getJokes();
    }

    handleVote = (id, delta) => {
        this.setState(ctState => ({
            jokes: ctState.jokes.map(joke => 
                joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
            )
        }),
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)),
        );
    }
    render() {
        return(
            <div className='JokeList'>
                <div className='JokeList-sidebar'>
                    <h1 className='JokeList-title'>
                        <span>Dad</span> Jokes
                    </h1>
                    <img 
                        src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'/>
                    <button className='JokeList-getmore' onClick={this.handleClick}>New Jokes</button>
                </div>

                <div className='JokeList-jokes'>
                    {this.state.jokes.map(joke => {
                       return <Joke 
                                    key={joke.id}
                                    text={joke.text}
                                    votes={joke.votes}
                                    upvote={() => this.handleVote(joke.id, 1)}
                                    downvote={() => this.handleVote(joke.id, -1)}
                                />;
                    })}
                </div>
            </div>
        );
    }
}

export default JokeList;