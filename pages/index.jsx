import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import appConfig from "../config.json";
import React from "react";
import { useRouter } from "next/router";

function Titulo(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.primary["400"]};
          font-size: 30px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function PaginaInicial() {
  // ======== STATES
  // Usuario temp. ( sendo digitado )
  const [tUsername, setTUsername] = React.useState("");
  // Usuario escolhido (Terminou de digitar)
  const [username, setUsername] = React.useState("pedro-sidra");
  // Timeout para a escrita
  const [typeTimeout, setTypeTimeout] = React.useState("");

  // User info from API
  const [userInfo, setUserInfo] = React.useState("");

  // Router
  const roteamento = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Use a random image from unsplash.com as the background
          // (Matrix is cool @alura, but it gets boring the 100th time!)
          backgroundImage:
            "url(https://source.unsplash.com/random/?background)",
          // Keep background color to give a cool shade
          backgroundColor: appConfig.theme.colors.neutrals["200"],
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "10px",
            padding: "30px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: "rgba(24,31,37,0.9)",
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (props) {
              props.preventDefault();
              console.log("Submetido:", props);
              roteamento.push("/chat");
              // window.location.href="/chat"
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Titulo tag="h2">
              Bem vindo{userInfo.name ? ", " + userInfo.name : ""}!
            </Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              fullWidth
              value={tUsername}
              onChange={function (event) {
                const valor = event.target.value;
                console.log("digitou:", valor);

                setTUsername(valor);

                if (typeTimeout) {
                  clearTimeout(typeTimeout);
                }

                setTypeTimeout(
                  setTimeout(() => {
                    if (tUsername.length > 2) {
                      fetch("https://api.github.com/users/" + valor)
                        .then(function (response) {
                          if (response.ok) {
                            response.json().then(function (json) {
                              console.log(json.login);

                              setUsername(valor);
                              setUserInfo(json);
                            });
                          }
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                    }
                  }, 500)
                );
              }}
              placeholder="Seu usuário aqui"
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[600],
                mainColorLight: appConfig.theme.colors.primary[500],
                mainColorStrong: appConfig.theme.colors.primary[700],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "240px",
              padding: "4px",
              // backgroundColor: appConfig.theme.colors.neutrals[800],
              // border: '1px solid',
              // borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              src={`https://github.com/${username}.png`}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
