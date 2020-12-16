import React from "react";
import "./css/EmailBody.css";

const EmailBody = ({
  body,
  currentSubject,
  currentDate,
  currentSender,
  currentId,
  markAsFav,
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", borderSpacing: "10px" }}
      className="upperbody"
    >
      <div
        className="avatar"
        style={{
          paddingLeft: "0.4em",
          marginTop: "-2em",
          fontSize: "2em",
          margin: "5px",
        }}
      >
        {currentSender[0]}
      </div>
      <div className="body">
        <h1>
          {currentSubject}
          <button
            style={{
              marginLeft: "65vh",
              background: "#e54065",
              border: "none",
              borderRadius: "5%",
              color: "white",
              cursor: "pointer",
              outline: "none",
            }}
            onClick={markAsFav}
          >
            Favourite
          </button>
        </h1>
        <p>From {currentSender}</p>
        <p>{currentDate}</p>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
};

export default EmailBody;
