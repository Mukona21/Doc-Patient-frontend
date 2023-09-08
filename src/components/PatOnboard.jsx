import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';


import React from 'react'
import "../CSS/onboard.css"
import { useEffect, useState, useContext } from 'react'
import { UserContext } from "../Contexts/UserContext";
import axiosClient from '../ApiConfig';
import { useNavigate } from 'react-router-dom';

function PatOnboard() {
    let navigate = useNavigate();
    let { user, setUser, token, setToken, refreshToken, setRefreshToken, logout, role, setRole } = useContext(UserContext);
    let [loading, setLoading] = useState(true);
    let [conditions, setConditions] = useState([]);
    let [lookingfor, setLookingfor] = useState([]);

    const LOOK_FOR = ["Epidemiologist", "Podiatrist", "Audiologist", "General Practitioner", "Pediatrician",
        "ENT Specialist", "OBGYN", "Oncologist", "Dentist", "Neonatologist", "Orthopedist", "Surgeon", "Neurologist", "Rheumatologist", "Geriatric Physician", "Urologist", "Gastroenterologist", "Dermatologist", "Endocrinologist", "Plastic surgeon", "Psychiatrist", "Anesthesiologist", "Nephrologist", "Radiologist", "Cardiologist"];

    const CONDS = ["Atherosclerosis", "Cardiomyopathy", "Atrial fibrillation", "Coronary heart disease", "Fatty liver", "Hepatitis", "Cirrhosis", "Chronic kidney disease", "Gallstones", "Polycystic kidney disease",
        "Epilepsy", "Parkinson's disease", "Depression", "Alzheimer’s disease", "Dementia", "Schizophrenia", "Peptic ulcer", "Acidity", "Appendicitis", "Asthma", "Dyspepsia", "Allergic rhinitis", "Pneumonia", "Tuberculosis"];

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
        let onboardPat = {
            email: "ahindra@mail.com",//user.email
            conditions: conditions,
            lookingfor: lookingfor,
            age: data.get('age'),
            gender: data.get('gender'),
            city: data.get('city'),
            country: data.get('country'),
        };
        //console.log(onboardPat);
        data.append("email", user.email);
        data.append("conditions", JSON.stringify(conditions));
        data.append("lookingfor", JSON.stringify(lookingfor));
        //data.append("image", selectedImage);
        
        let response = await fetch("https://docseek.onrender.com/patient/onboard", {
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
        console.log("submit");
        navigate("/patient/home");
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
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                color="success"
                                id="city"
                                label="City"
                                name="city"
                                autoComplete="City"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                color="success"
                                name="country"
                                label="Country"
                                id="country"
                                autoComplete="Country"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                options={["Male", "Female", "Others"]}
                                getOptionLabel={(option) => option.toString()}
                                sx={{ width: 400 }}
                                renderInput={(params) => <TextField {...params}
                                    fullWidth
                                    id="gender"
                                    name="gender"
                                    label="Gender"
                                    autoComplete="Gender"
                                />}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                color="success"
                                type="number"
                                name="age"
                                label="Age"
                                id="age"
                                autoComplete="Age"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                multiple
                                limitTags={2}
                                options={CONDS}
                                getOptionLabel={(option) => option.toString()}
                                sx={{ width: 400 }}
                                renderInput={(params) => <TextField {...params}
                                    fullWidth
                                    id="conditions"
                                    name="conditions"
                                    label="Conditions" />}
                                onChange={(event, newValue) => {
                                    //console.log(newValue);
                                    setConditions(newValue);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                multiple
                                limitTags={2}
                                options={LOOK_FOR}
                                getOptionLabel={(option) => option.toString()}
                                sx={{ width: 400 }}
                                renderInput={(params) => <TextField {...params}
                                    fullWidth
                                    id="lookingfor"
                                    name="lookingfor"
                                    label="Looking For" />}
                                onChange={(event, newValue) => {
                                    //console.log(newValue);
                                    setLookingfor(newValue);
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

export default PatOnboard;