import React, { useState, useEffect } from "react"
import { db } from "../firebase-config"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"

function FirebaseTest() {
    const [members, setMembers] = useState([])
    const membersCollectionRef = collection(db, "members")
    const [newFirstName, setNewFirstName] = useState("")
    const [newLastName, setNewLastName] = useState("")
    const [newJerseyNumber, setNewJerseyNumber] = useState(0)
    
    const createMember = async () => {
        await addDoc(membersCollectionRef, 
            {firstName: newFirstName, 
                lastName: newLastName, 
                jerseyNumber: Number(newJerseyNumber)
            }
        )
    }

    const updateMember = async (id, jerseyNumber) => {
        const memberDoc = doc(db, "members", id)
        const newFields = {jerseyNumber: jerseyNumber + 1}
        await updateDoc(memberDoc, newFields)
    }

    const deleteMember = async (id) => {
        const memberDoc = doc(db, "members", id)
        await deleteDoc(memberDoc)
    }

    useEffect(() => {
        const getMembers = async () => {
            const data = await getDocs(membersCollectionRef);
            setMembers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }

        getMembers()
    }, [])


    return(
        <div>
            <input placeholder="Vorname..." onChange={(event) => {setNewFirstName(event.target.value)}} />
            <input placeholder="Nachname..." onChange={(event) => {setNewLastName(event.target.value)}}/>
            <input type="number" placeholder="Trikotnummer..." onChange={(event) => {setNewJerseyNumber(event.target.value)}}/>
            <button onClick={createMember}>Member anlegen</button>
            {members.map((member) => {
                return ( 
                    <div key={member.id}>
                        <h1>Name: {member.firstName} {member.lastName}</h1>
                        <h2>Trikotnummer: {member.jerseyNumber}</h2>
                        <button onClick={() => {updateMember(member.id, member.jerseyNumber)}}>Trikotnummer erhöhen</button>
                        <button onClick={() => {deleteMember(member.id)}}>Member löschen</button>
                    </div>
                )
            })}
        </div>
    )
}

export default FirebaseTest