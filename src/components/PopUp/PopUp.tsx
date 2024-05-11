import React, { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { LogoSVG } from "../../img/LogoSVG";
import "./reset.css";
import "./popup.css";
import SendButtonSVG from "../../img/SendButtonSVG";
import CloseButton from "../../img/CloseButtonSVG";

const getDialogue = async (userID: string) => {
  const data = await fetch(
    "http://localhost:5001/api/messages/getUsersMessages",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users_hex: ["123", userID] }),
    }
  )
    .then((response) => response.json())
    .then((data) => data);
  return data;
};

const sendMessage = async (
  from_hex: string,
  to_hex: string,
  message: string
) => {
  const data = await fetch(
    "http://localhost:5001/api/messages/addUserMessage",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_hex: from_hex,
        to_hex: to_hex,
        message: message,
      }),
    }
  );
  return data;
};

const PopUp: any = ({ operator_id }: any) => {
  const [active, setActive] = useState(false);

  const [messages, setMessages] = useState<any>([]);
  const [newMsg, setNewMsg] = useState<string>("");

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateUserId = () => {
    const hex = "0123456789ABCDEF";
    let output = "";
    if (localStorage.getItem("UserID")) {
      return;
    } else {
      for (let i = 0; i < hex.length; i++) {
        output += hex.charAt(Math.floor(Math.random() * 16));
      }
      localStorage.setItem("UserID", output);
    }
  };
  generateUserId();

  useEffect(() => {
    getDialogue(userID)
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.log("ошибка!!!");
        console.error(error);
      });

    const subscribe = setInterval(() => {
      getDialogue(userID)
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => {
          console.log("ошибка!!!");
          console.error(error);
        });
    }, 5000);

    return () => {
      clearInterval(subscribe);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  let userID = String(localStorage.getItem("UserID"));

  const pressOnSendButton = async () => {
    if (newMsg !== "") {
      setMessages([...messages, { message: newMsg }]);
      sendMessage(userID, "123", newMsg);
      setNewMsg("");
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13) {
      if (newMsg !== "") {
        setMessages([...messages, { message: newMsg }]);
        sendMessage(userID, "123", newMsg);
        setNewMsg("");
      }
    }
  };
  return (
    <div className="popup">
      <div className="popup__container">
        <div onClick={() => setActive(!active)} className="popup__header">
          <LogoSVG />
          <div className="operator__info">
            <div className="operator__info__name">Консультант</div>
            <div className="operator__info__status">Онлайн</div>
          </div>
          {active && (
            <div className="popup__close__button">
              <CloseButton />
            </div>
          )}
        </div>
        <div className={active ? "chat__active" : "chat"}>
          <div className="chat__container">
            <div className="scrollbar">
              <div className="msg__block">
                <div className="chat__operator__msg">
                  Здравствуйте! Отдел продаж на связи. С радостью отвечу на Ваши
                  вопросы.
                </div>
                {messages.map((message: any, index: number) => (
                  <div
                    key={index}
                    className={
                      message.from_hex !== "123"
                        ? "chat__user__msg"
                        : "chat__operator__msg"
                    }
                  >
                    {message.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="send__message__block">
              <input
                value={newMsg}
                className="input__msg"
                placeholder="Введите сообщение"
                onKeyDown={(e) => handleKeyPress(e)}
                onChange={(e) => setNewMsg(e.target.value)}
              ></input>
              {newMsg && (
                <button
                  onClick={() => pressOnSendButton()}
                  className="send__msg"
                >
                  <SendButtonSVG />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
