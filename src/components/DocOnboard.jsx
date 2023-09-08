import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';

import React from 'react'
import "../CSS/onboard.css"
import { useEffect, useState, useContext, useRef } from 'react'
import { UserContext } from "../Contexts/UserContext";
import axiosClient from '../ApiConfig';
import { useNavigate } from 'react-router-dom';

function DocOnboard() {
    let [selectedImage, setSelectedImage] = useState();
    let fileInputRef = useRef(null);
    // This function will be triggered when the file field change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };



    let navigate = useNavigate();
    let { user, setUser, token, setToken, refreshToken, setRefreshToken, logout, role, setRole } = useContext(UserContext);
    let [loading, setLoading] = useState(true);
    let [timeSlots, setTimeSlots] = useState([]);
    let [daysA, setDaysA] = useState([]);

    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const TIME_SLOTS = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30","14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30","20:00", "20:30"];

    useEffect(() => {
        if (user == null) {
            setUser(() => JSON.parse(localStorage.getItem("user_data")));
            setToken(() => localStorage.getItem("access_token"));
            setRefreshToken(() => localStorage.getItem("refresh_token"));
        }
        setLoading(false);
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let onboardDoc = {
            email: user.email,//user.email
            time: timeSlots,
            days: daysA,
            qualification: data.get('qualification'),
            speciality: data.get('speciality'),
            hospital: data.get('hospital'),
            experience: data.get('experience'),
            fee: data.get('fee'),
            city: data.get('city'),
            country: data.get('country'),
            image: selectedImage,
        };
        //console.log(onboardDoc)
        //console.log(days);
        //console.log(timeSlots);
        data.append("email", user.email);//user.email
        data.append("time", JSON.stringify(timeSlots));
        data.append("days", JSON.stringify(daysA));
        data.append("image", selectedImage);
        ///*
        let response = await fetch("https://docseek.onrender.com/doctor/onboard", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data,
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        let respData = await response.json();
        if (respData.error != undefined) {
            window.alert(respData.error);
            return;
        }
        //console.log(days);
        //console.log(timeSlots);
        console.log("submit");
        navigate("/doctor/home");
        //*/
    };

    return (
        <div className='onboard-cont'>
            <div className="onboard-card">
                <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
                    <HealthAndSafetyTwoToneIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography component="h1" variant="h3">
                    Register Yourself
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <div style={styles.container}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button variant="contained" component="label" color="success">
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={imageChange} id="image" />
                            </Button>
                            <IconButton color="success" aria-label="upload picture" component="label">
                                <input hidden accept="image/*" type="file" onChange={imageChange} id="image" />
                                <PhotoCamera />
                            </IconButton>
                        </Stack>
                        {selectedImage && (
                            <div style={styles.preview}>
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    style={styles.image}
                                    alt="Thumb"
                                />
                            </div>
                        )}
                    </div>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                color="success"
                                id="qualification"
                                label="Qualification"
                                name="qualification"
                                autoComplete="Qualification"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                color="success"
                                name="speciality"
                                label="Speciality"
                                id="speciality"
                                autoComplete="Speciality"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                color="success"
                                id="hospital"
                                label="Hospital"
                                name="hospital"
                                autoComplete="Hospital"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                color="success"
                                type="number"
                                name="experience"
                                label="Experience"
                                id="experience"
                                autoComplete="Experience"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                color="success"
                                id="city"
                                label="City"
                                name="city"
                                autoComplete="City"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                color="success"
                                name="country"
                                label="Country"
                                id="country"
                                autoComplete="Country"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                color="success"
                                type="number"
                                name="fee"
                                label="Fees ($)"
                                id="fee"
                                autoComplete="Fee"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                multiple
                                limitTags={3}
                                options={TIME_SLOTS}
                                getOptionLabel={(option) => option.toString()}
                                sx={{ width: 400 }}
                                renderInput={(params) => <TextField {...params}
                                    fullWidth
                                    id="timeslots"
                                    name="timeslots"
                                    label="Time Slots (24hrs)" />}
                                onChange={(event, newValue) => {
                                    //console.log(newValue);
                                    setTimeSlots(newValue);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                multiple
                                limitTags={2}
                                options={DAYS}
                                getOptionLabel={(option) => option.toString()}
                                sx={{ width: 400 }}
                                renderInput={(params) => <TextField {...params}
                                    fullWidth
                                    id="Days"
                                    name="Days"
                                    label="Days Available" />}
                                onChange={(event, newValue) => {
                                    //console.log(newValue);
                                    setDaysA(newValue);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="success"
                    >
                        ONBOARD
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default DocOnboard;



const styles = {
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    preview: {
        marginTop: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    image: { maxWidth: "40%", maxHeight: 320, borderRadius: 5 },
};