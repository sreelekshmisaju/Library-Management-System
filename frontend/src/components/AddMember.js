import React, { useState, useEffect } from "react";
import "./AddMember.css";

function AddMember() {
    const [member, setMember] = useState({
        name: "",
        membership_id: "",
    });
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5002/members");
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!member.name || !member.membership_id) {
            alert("All fields are required!");
            return;
        }
        try {
            const response = await fetch("http://localhost:5002/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: member.name,
                    membership_id: member.membership_id,
                }),
            });
            if (response.ok) {
                alert("Member added successfully!");
                setMember({ name: "", membership_id: "" });
                fetchMembers();
            } else {
                const error = await response.json();
                alert(`Error: ${error.detail}`);
            }
        } catch (error) {
            alert("Failed to add member: " + error.message);
        }
    };

    const handleDeleteMember = async (membershipId) => {
        try {
            const response = await fetch(`http://localhost:5002/delete-member/${membershipId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Member deleted successfully!");
                fetchMembers();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            alert("Failed to delete member: " + error.message);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <div className="add-member-container">
            <h2>Add Member</h2>
            <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) => setMember({ ...member, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Membership ID"
                value={member.membership_id}
                onChange={(e) => setMember({ ...member, membership_id: e.target.value })}
            />
            <button onClick={handleAddMember}>Add Member</button>

            {loading && <p>Loading members...</p>}

            <h3>Members List</h3>
            <table className="members-list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Membership ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.membership_id}>
                            <td>{member.name}</td>
                            <td>{member.membership_id}</td>
                            <td>
                                {!member.deleted ? (
                                    <button onClick={() => handleDeleteMember(member.membership_id)}>
                                        Delete
                                    </button>
                                ) : (
                                    <span>(Deleted)</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddMember;
