import React from 'react'
import "../CSS/startgame.css"
import { useEffect, useState, useContext, useRef } from 'react'
import { UserContext, socket } from "../Contexts/UserContext";
import axiosClient from '../ApiConfig';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

function StartGame() {
    const subjectID = useParams().id;
    let navigate = useNavigate();
    let { user, setUser, token, setToken, refreshToken, setRefreshToken, logout, quizArr, setQuizArr, room, setRoom } = useContext(UserContext);
    let [loading, setLoading] = useState(true);
    let [students, setStudents] = useState([]);
    let [quiz, setQuiz] = useState(null);

    useEffect(() => {
        if (user == null) {
            setUser(() => JSON.parse(localStorage.getItem("user_data")));
            setToken(() => localStorage.getItem("access_token"));
            setRefreshToken(() => localStorage.getItem("refresh_token"));
        }
        fetchData();
        setLoading(false);
        socket.on("room-created", (data) => {
            //newStudent, students 
            //setStudents(() => data.students);
        });
        socket.on("new-student", (data) => {
            //newStudent, students 
            setStudents(() => data.students);
        });
    }, [])

    async function fetchData() {
        let resp = await axiosClient.get(`/subject/${subjectID}`);
        setQuiz(() => resp.data[0].quiz);
        let randomK = Math.random().toString().substring(3, 11);
        //console.log(randomK);
        setRoom(() => randomK);
        setQuizArr(() => resp.data[0].quiz);
        localStorage.setItem("quizArr", JSON.stringify(resp.data[0].quiz));
        localStorage.setItem("roomID", randomK);
        socket.emit("create-room", { roomID: randomK, owner: socket.id, quizArr: resp.data[0].quiz, subjectID });
    }

    function startGame() {
        socket.emit("start-game", { roomID: room, owner: socket.id, quizArr, subjectID });
        navigate("/display");
    }

    //http://localhost:8000/
    //https://kahoot.up.railway.app/

    return (
        <div className='start-cont'>
            <div className="start-card">
                <div className="start-top" onClick={() => { navigate("/home") }}>
                    <img src="../images/logo2.png" alt="" />
                </div>
                {loading ? <h1>loading...</h1> :
                    <div className="start-bottom">
                        <div className="start-left">
                            {students.length <= 0 ? <h1>Waiting for players...</h1> :
                                students.map((elem) => {
                                    return (
                                        <div className="student-ind" key={elem}>
                                            <div className="avatar">
                                                <img src="../images/user.png" alt="" />
                                            </div>
                                            <p className="stu-name">{elem}</p>
                                        </div>
                                    )
                                })}
                        </div>
                        <div className="start-right">
                            <QRCodeSVG value={`https://kahoot.up.railway.app/join/${room}`} height="400" width="400" fgColor="black" includeMargin="false" />
                            <p className="code">Game PIN: <b>{room}</b></p>
                            <button className='start-bttn' onClick={() => startGame()}>Start Game</button>
                        </div>

                    </div>
                }
            </div>
        </div>
    )
}

export default StartGame