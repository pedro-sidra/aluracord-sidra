import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { useRouter } from "next/router";
import React, { useState } from "react";
import appConfig from "../config.json";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import react from "react";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ2ODA4MiwiZXhwIjoxOTU5MDQ0MDgyfQ.K_kZEeB_elDSsyKTtvV-x7G-EJyinInL2_DKR1fw_dQ";
const SUPABASE_URL = "https://hjrthpfurhaiopxgkemf.supabase.co";

// Create a single supabase client for interacting with your database
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagens(addMensagens, removeMensagens) {
  return supabaseClient
    .from("mensagens")
    .on("*", (data) => {
      if (data.eventType === "INSERT") {
        addMensagens(data);
      }
      if (data.eventType === "DELETE") {
        removeMensagens(data);
      }
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);

  const roteamento = useRouter();

  const picture = roteamento.query.picture;
  const loggedIn = roteamento.query.username;

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setMensagens(data);
      });

    escutaMensagens(
      (data) => {
        setMensagens((current) => {
          return [data.new, ...current];
        });
      },
      (data) => {
        setMensagens((current) => {
          return current.filter((item) => {
            return item.id != data.old.id;
          });
        });
      }
    );
  }, []);

  function deleteMessage(messageId) {
    return (event) => {
      supabaseClient
        .from("mensagens")
        .delete()
        .match({ id: messageId })
        .then((response) => {
          console.log(response);
        });
      // setMensagens(
      //   mensagens.filter((item) => {
      //     return item.id != messageId;
      //   })
      // );
    };
  }
  function sendMessage(message) {
    if (message.length === 0) {
      return;
    }
    const new_mensagem = {
      texto: message,
      de: loggedIn,
    };

    supabaseClient
      .from("mensagens")
      .insert([new_mensagem])
      .then((response) => {
        console.log(response.data[0]);
        // setMensagens([response.data[0], ...mensagens]);
      });

    // Limpar vari??vel
    setMensagem("");
  }

  // ./Sua l??gica vai aqui
  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.neutrals["050"],
        backgroundImage: `url(${picture})`,
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
          maxWidth: "1080px",
          margin: "2em 2em",
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
          <MessageList
            mensagens={mensagens}
            setMensagens={setMensagens}
            onDelete={deleteMessage}
            loggedIn={loggedIn}
          />

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
                  event.preventDefault();
                  sendMessage(mensagem);
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
              onClick={() => {
                sendMessage(mensagem);
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["900"],
                mainColor: "#0CD44F",
                mainColorLight: "#51F588",
                mainColorStrong: "#099A39",
              }}
              styleSheet={{
                width: "5em",
                height: "90%",
                marginRight: "1em",
              }}
            />

            <ButtonSendSticker
              onStickerClick={(sticker) => {
                sendMessage(`:sticker: ${sticker}`);
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
      {props.mensagens.length > 0 &&
        props.mensagens.map((item, index) => {
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
              {(props.mensagens[index + 1] || { de: undefined }).de ===
              item.de ? (
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
                    src={`https://github.com/${item.de}.png`}
                  />
                  <Text tag="strong">{item.de}</Text>
                  <Text
                    styleSheet={{
                      fontSize: "10px",
                      marginLeft: "8px",
                      color: appConfig.theme.colors.neutrals[300],
                    }}
                    tag="span"
                  >
                    {new Date(item.created_at).toLocaleDateString("pt-br", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
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
                {item.texto.startsWith(":sticker:") ? (
                  <Image
                    width="200px"
                    src={item.texto.replace(":sticker:", "")}
                  ></Image>
                ) : (
                  item.texto
                )}
                {item.de === props.loggedIn && (
                  <Button
                    label="x"
                    variant="tertiary"
                    size="xs"
                    onClick={props.onDelete(item.id)}
                  />
                )}
              </Box>
            </Text>
          );
        })}
    </Box>
  );
}
