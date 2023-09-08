import React from 'react'
import "../CSS/patHome.css"
import { useEffect, useState, useContext, useRef } from 'react'
import { UserContext } from "../Contexts/UserContext";
import axiosClient from '../ApiConfig';
import { useNavigate } from 'react-router-dom';
import BsStarFill from "../CSS/star";
import AiFillHome from "../CSS/logo";

function PatHome() {
    let navigate = useNavigate();
    let { user, setUser, token, setToken, refreshToken, setRefreshToken, logout, role, setRole } = useContext(UserContext);
    let [loading, setLoading] = useState(true);
    let [docs, setDocs] = useState([]);

    useEffect(() => {
        if (user == null) {
            setUser(() => JSON.parse(localStorage.getItem("user_data")));
            setToken(() => localStorage.getItem("access_token"));
            setRefreshToken(() => localStorage.getItem("refresh_token"));
        }
        fetchData();
    }, [])

    async function fetchData() {
        let resp = await axiosClient.get("/doctor/all");
        setDocs(() => resp.data);
        console.log(resp.data);
        setLoading(false);
    }

    function chooseDoc(docID) {
        navigate(`/patient/home/${docID}`);
    }

    return (
        <div className='phome-cont'>
            <div className="phome-top">
                <div className="phome-logo" onClick={() => { navigate(`/${role}/home`) }}>
                    DocSeek<AiFillHome />
                </div>
                <div className='bttn-cont'>
                    <button className='appoint-bttn' onClick={() => navigate(`/${role}/appoints`)}>Appointments</button>
                    <button className='logout-bttn' onClick={() => logout()}>Logout</button>
                </div>
            </div>
            <div className="doc-search">
                <div className="search-bar">
                    <input type="text" placeholder='Find Doctors Nearby' />
                </div>
                <button className="search-bttn">SEARCH</button>
            </div>

            {loading ? <h1 style={{ margin: "0 auto" }}>loading...</h1> :
                <div className="phome-bottom">
                    {docs.map((elem) => {
                        if (elem.hospital == undefined) {
                            return;
                        }
                        return (
                            <div className="doc-ind" key={elem._id} onClick={() => chooseDoc(elem._id)}>
                                <div className="doc-img">
                                    <img src={elem.imageURL} alt="" />
                                </div>
                                <div className="r1">
                                    <p className="doc-name">{elem.name},</p>
                                    <p className="doc-qual"> <b>{elem.qualification}</b> </p>
                                </div>
                                <div className="r1">
                                    <p className="doc-spec">{elem.speciality},</p>
                                    <p className="doc-hosp">{elem.hospital}</p>
                                </div>
                                <div className="r1">
                                    <p>Rating:  </p>
                                    <p className="doc-rating"><BsStarFill /> {elem.rating}</p>
                                </div>
                                <div className="r1">
                                    <p>Fees:  </p>
                                    <p className="doc-rating">$ {elem.fee}/Session</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div >
    )
}

export default PatHome