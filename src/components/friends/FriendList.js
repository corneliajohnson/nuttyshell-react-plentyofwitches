import React, { useContext, useEffect, useState } from "react";
import { FriendContext } from "./FriendProvider";
import { UserContext } from "../users/UserProvider";
import { FriendCard } from "./FriendCard";
import "./Friend.css";

export const FriendList = () => {
  const {
    friends,
    getFriends,
    deleteFriend,
    addFriend,
    searchTerms,
  } = useContext(FriendContext);
  const { users, getUsers } = useContext(UserContext);
  const [filteredFriendUsers, setFriendUsers] = useState([]);
  const [filteredNotFriendUsers, setNotFriendUsers] = useState([]);

  //delete two-way friendship from database
  const removeFriendship = (id) => {
    friends.map((friend) => {
      if (friend.userId === id) {
        deleteFriend(friend.id);
      }
      if (friend.followingId === id) {
        deleteFriend(friend.id);
      }
    });
  };

  //add two-way friendship to database
  const addFriendship = (id) => {
    const currentUser = parseInt(localStorage.user);
    addFriend({ userId: id, followingId: currentUser });
    addFriend({ userId: currentUser, followingId: id });
  };

  //get friends and users from database when searchTerms or frinnd status change
  useEffect(() => {
    getFriends().then(getUsers);
  }, []);

  //get friends and users from database on page load
  useEffect(() => {
    //get the current user friends
    const friendsOfUser = friends.filter(
      (friend) => friend.userId === parseInt(localStorage.user)
    );

    //get and array of the current user friends Ids
    const followingId = friendsOfUser.map((friend) => friend.followingId);

    //get the user objects for the current user friends
    const friendInformation = users.filter(
      (user) =>
        followingId.includes(user.id) && user.id !== parseInt(localStorage.user)
    );

    //get the user objects of who the user is not friends with
    const nonFriendInformation = users.filter(
      (user) =>
        followingId.includes(user.id) === false &&
        user.id !== parseInt(localStorage.user)
    );

    if (searchTerms !== "") {
      //search through friends by userId/name
      const friendSubset = friendInformation.filter(
        (friend) =>
          friend.username
            .toLowerCase()
            .includes(searchTerms.toLowerCase().trim()) ||
          friend.firstName
            .toLowerCase()
            .includes(searchTerms.toLowerCase().trim()) ||
          friend.lastName
            .toLowerCase()
            .includes(searchTerms.toLowerCase().trim())
      );
      //search through nonfriends by userId/name
      const nonFriendSubset = nonFriendInformation.filter(
        (friend) =>
          friend.username
            .toLowerCase()
            .includes(searchTerms.toLowerCase().trim()) ||
          friend.firstName
            .toLowerCase()
            .includes(searchTerms.toLowerCase().trim()) ||
          friend.lastName
            .toLowerCase()
            .includes(searchTerms.toLowerCase().trim())
      );
      // If the search field is not blank, display matching friends/nonfriends
      setFriendUsers(friendSubset);
      setNotFriendUsers(nonFriendSubset);
    } else {
      // If the search field is blank, display all friends/nonfriends
      setFriendUsers(friendInformation);
      setNotFriendUsers(nonFriendInformation);
    }
  }, [friends, users, searchTerms]);

  return (
    <>
      <div className="friends">
        {/* map through friends */}
        {filteredFriendUsers.map((user) => (
          <FriendCard
            key={user.id}
            friend={user}
            isFriend={
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  removeFriendship(user.id);
                }}
              >
                {" "}
                Delete{" "}
              </button>
            }
          />
        ))}
      </div>
      <h2>Add Friends</h2>
      {/* map through nonfriends */}
      <div className="friends">
        {filteredNotFriendUsers.map((user) => (
          <>
            <FriendCard
              key={user.id}
              friend={user}
              isFriend={
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    addFriendship(user.id);
                  }}
                >
                  {" "}
                  Add{" "}
                </button>
              }
            />
          </>
        ))}
      </div>
    </>
  );
};
