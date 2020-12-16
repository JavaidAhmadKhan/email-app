import React from "react";
import Email from "./Email";

const processDate = (date) => {
  let time = date;
  let formattedDate = new Date(time);
  const mnth = ("0" + (formattedDate.getMonth() + 1)).slice(-2);
  const day = ("0" + formattedDate.getDate()).slice(-2);
  const hours = ("0" + formattedDate.getHours()).slice(-2);
  const minutes = ("0" + formattedDate.getMinutes()).slice(-2);
  const displayTime = [hours - 12, minutes].join(":");
  const displayDate = [day, mnth, formattedDate.getFullYear()].join("-");
  return [displayDate, " ", displayTime, " ", hours > 12 ? "pm" : "am"];
};

const EmailList = ({ email, onClick, read, markfav, currentCard }) => {
  return (
    <div>
      {email.map((__, index) => {
        return (
          <Email
            key={index}
            currentCard={currentCard}
            id={email[index].id}
            name={email[index].from.name}
            email={email[index].from.email}
            subject={email[index].subject}
            markfav={markfav}
            shortDesc={email[index].short_description}
            date={processDate(email[index].date)}
            onClick={onClick}
            read={read}
          />
        );
      })}
    </div>
  );
};

export default EmailList;
