import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { useRouter } from "next/router";
import React, { useState } from "react";
import appConfig from "../config.json";

export default function ChatPage() {
  // Sua lógica vai aqui

  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);

  function sendMessage() {
    if (mensagem.length === 0) {
      return;
    }
    const new_mensagem = {
      id: mensagens.length,
      message: mensagem,
      user: "pedro-sidra",
      user_name: "Pedro",
      date: new Date().toLocaleDateString(),
    };

    // Jeito idiota
    // mensagens.push(new_mensagem);
    // setMensagens(mensagens);

    // Jeito do @omariosouto
    setMensagens([new_mensagem, ...mensagens]);

    // Limpar variável
    setMensagem("");
  }

  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={mensagens} setMensagens={setMensagens} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              value={mensagem}
              // Update message
              onChange={function (event) {
                const value = event.target.value;
                setMensagem(value);
              }}
              // Send message
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  console.log(event);
                  event.preventDefault();
                  sendMessage();
                  console.log(mensagens);
                }
              }}
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                marginBottom: "-8px", // fiz uma gambiarra aqui...
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <Button
              label="Enviar"
              onClick={sendMessage}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["900"],
                mainColor: "#0CD44F",
                mainColorLight: "#51F588",
                mainColorStrong: "#099A39",
              }}
              styleSheet={{
                width: "5em",
                height: "100%",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  // Router
  const roteamento = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          onClick={() => {
            roteamento.push("/");
          }}
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  function deleteMessage(messageId) {
    return (event) => {
      props.setMensagens(
        props.mensagens.filter((item) => {
          return item.id != messageId;
        })
      );
    };
  }
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((item, index) => {
        return (
          <Text
            key={item.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            {(props.mensagens[index + 1] || { user: undefined }).user ===
            item.user ? (
              // Don`t show user pic if the last message already did
              <></>
            ) : (
              // Show user pic + date
              <Box
                styleSheet={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${item.user}.png`}
                />
                <Text tag="strong">{item.user_name}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {item.date}
                </Text>
              </Box>
            )}
            <Box
              styleSheet={{
                display: "flex",
                justifyContent: "space-between",
                whiteSpace: "pre-line",
              }}
            >
              {item.message}
              <Button
                label="x"
                variant="tertiary"
                size="xs"
                onClick={deleteMessage(item.id)}
              />
            </Box>
          </Text>
        );
      })}
    </Box>
  );
}
