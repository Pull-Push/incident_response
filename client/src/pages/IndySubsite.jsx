import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getIndySubsite, updateSubsite, deactivateSubsite } from '../services/api'

export default function IndySubsite(){
    const {subsiteId} = useParams()
    const navigate = useNavigate()
}