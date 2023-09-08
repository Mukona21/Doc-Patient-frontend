import React from 'react'
import "../CSS/patAppoint.css"
import { useEffect, useState, useContext, useRef } from 'react'
import { UserContext } from "../Contexts/UserContext";
import axiosClient from '../ApiConfig';
import { useNavigate } from 'react-router-dom';
import BsStarFill from "../CSS/star";
import AiFillHome from "../CSS/logo";

function DocAppoints() {
    let navigate = useNavigate();
    let { user, setUser, token, setToken, refreshToken, setRefreshToken, logout, role, setRole } = useContext(UserContext);
    let [loading, setLoading] = useState(true);
    let [appoints, setAppoints] = useState([]);//"upcoming","completed","cancelled"

    let [showCard, setShowCard] = useState(false);
    let [presciption, setPresciption] = useState("");
    let [appointID, setAppointID] = useState("");

    function toggleCard() {
        setShowCard((prev) => !prev);
    }
    async function markDone() {
        let response = await fetch(`https://docseek.onrender.com/appoint/complete/${appointID}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body:JSON.stringify( {
                "presciption": presciption
            }),
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        let respData = await response.json();
        if (respData.error != undefined) {
            window.alert(respData.error);
            return;
        } else {
            window.alert("Appointment Completed!");
        }
        toggleCard();
        fetchData();
        setPresciption(() => "")
    }

    useEffect(() => {
        if (user == null) {
            setUser(() => JSON.parse(localStorage.getItem("user_data")));
            setToken(() => localStorage.getItem("access_token"));
            setRefreshToken(() => localStorage.getItem("refresh_token"));
        }
        fetchData();
    }, [])

    async function fetchData() {
        let resp = await axiosClient.get(`/appoint/doctor/${user._id}`);
        setAppoints(() => resp.data);
        console.log(resp.data);
        setLoading(false);
    }

    return (
        <div className='phome-cont'>
            <div className="phome-top">
                <div className="phome-logo" onClick={() => { navigate(`/doctor/home`) }}>
                    DocSeek <AiFillHome />
                </div>
                <div className='bttn-cont'>
                    <button className='appoint-bttn' onClick={() => navigate(`/doctor/appoints`)}>Appointments</button>
                    <button className='logout-bttn' onClick={() => logout()}>Logout</button>
                </div>
            </div>
            <p className='u-appoint'>Your Appointments</p>
            {
                loading ? <h1 style={{ margin: "0 auto" }}>loading...</h1> :
                    <div className="appoint-bottom">
                        <div className="appoint-upcoming">
                            <div className="upcoming">UPCOMING</div>

                            <div className="upcoming-cont">
                                {appoints.map((elem, i) => {
                                    if (elem.status !== "upcoming") { return }
                                    return (
                                        <div className="up-ind" key={i}>
                                            <div className="up-c1">
                                                <img src={elem.patient.imageURL} alt="" />
                                            </div>
                                            <div className="up-c2">
                                                <p> <b>Patient: {elem.patient.name}</b> </p>
                                                <p><b>Patients' note:</b>  {elem.prenote}</p>
                                            </div>
                                            <div className="up-c3">
                                                <div className="up-c3r1">Time: {elem.time}</div>
                                                <div className="up-c3r2">Date: {elem.date}</div>
                                            </div>
                                            <button className='done-appoint' onClick={() => {
                                                setAppointID(() => elem._id);
                                                toggleCard();
                                            }}>Done</button>
                                        </div>

                                    )
                                })}
                            </div>
                        </div>
                        <div className="appoint-completed">
                            <div className="completed">COMPLETED</div>
                            <div className="completed-cont">
                                {appoints.map((elem, i) => {
                                    if (elem.status !== "completed") { return }
                                    return (
                                        <div className="com-ind" key={i}>
                                            <div className="up-c1">
                                                <img src={elem.patient.imageURL} alt="" />
                                            </div>
                                            <div className="up-c2">
                                                <p> <b>Patient: {elem.patient.name}</b> </p>
                                                <p><b>Your note:</b>  {elem.presciption}</p>
                                            </div>
                                            <div className="up-c3">
                                                <div className="up-c3r1">Time: {elem.time}</div>
                                                <div className="up-c3r2">Date: {elem.date}</div>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
            }

            <div className={`overlay ${showCard ? "visible" : ""}`}>
                <div className="add-card">
                    <div className="close">
                        <button className='close-bttn' onClick={() => toggleCard()}>close</button>
                    </div>
                    <div className="sub-create">
                        <div className="sub-name">
                            <input type="text" placeholder='Write presciption' value={presciption} onChange={(e) => { setPresciption(() => e.target.value) }} />
                        </div>
                        <button className='done-appoint' onClick={() => {
                            markDone();
                        }}>DONE</button>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default DocAppoints