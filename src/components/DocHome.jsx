import React from 'react'
import "../CSS/docHome.css"
import { useEffect, useState, useContext, useRef } from 'react'
import { UserContext } from "../Contexts/UserContext";
import axiosClient from '../ApiConfig';
import { useNavigate } from 'react-router-dom';
import BsStarFill from "../CSS/star";
import AiFillHome from "../CSS/logo";

function DocHome() {
    let navigate = useNavigate();
    let { user, setUser, token, setToken, refreshToken, setRefreshToken, logout, role, setRole } = useContext(UserContext);
    let [loading, setLoading] = useState(true);
    let [doc, setDoc] = useState([]);

    useEffect(() => {
        if (user == null) {
            setUser(() => JSON.parse(localStorage.getItem("user_data")));
            setToken(() => localStorage.getItem("access_token"));
            setRefreshToken(() => localStorage.getItem("refresh_token"));
        }
        //console.log(user);
        fetchData();
    }, [])

    async function fetchData() {
        let resp = await axiosClient.get(`/doctor/${user._id}`);
        setDoc(() => resp.data[0]);
        setUser(() => resp.data[0]);
        console.log(resp.data[0]);
        setLoading(false);
    }

    return (
        <div className='book-cont'>
            <div className="phome-top">
                <div className="phome-logo" onClick={() => { navigate(`/doctor/home`) }}>
                    DocSeek <AiFillHome />
                </div>
                <div className='bttn-cont'>
                    <button className='appoint-bttn' onClick={() => navigate(`/doctor/appoints`)}>Appointments</button>
                    <button className='logout-bttn' onClick={() => logout()}>Logout</button>
                </div>
            </div>
            {
                loading ? <h1 style={{ margin: "0 auto" }}>loading...</h1> :
                    <div className="dhome-bottom">
                        <div className="doc-cont">
                            <div className="sq sq1">
                                <div className="my-img">
                                    <img src={doc.imageURL} alt="" />
                                </div>
                                <div className="my-desc">
                                    <p className="my-name">{doc.name}</p>
                                    <p className="my-location">{doc.city}, {doc.country}</p>
                                </div>
                            </div>
                            <div className="sq sq2">
                                <p className="my-data">Qualification: <b>{doc.qualification}</b> </p>
                                <p className="my-data">Specialization: <b>{doc.speciality}</b></p>
                                <p className="my-data">Currently at: <b>{doc.hospital}</b></p>
                                <p className="my-data">Experience: <b>{doc.experience} Yrs</b></p>
                            </div>

                            <div className="sq sq4">
                                <p className="my-rating"> <b>{doc.rating}</b></p>
                                <p className="my-data"> RATING</p>
                            </div>
                            <div className="sq sq3">
                                <p className="my-review"> <b>❝{doc.reviews[0]}❞</b></p>
                                <p className="my-data"> REVIEWS</p>
                            </div>
                            <div className="sq sq5">
                                <p className="my-rating"> <b>$ {doc.fee}</b></p>
                                <p className="my-data"> FEES / SESSION</p>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default DocHome