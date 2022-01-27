import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import appConfig from "../config.json";
import React from "react";
import { useRouter } from "next/router";

export default function PaginaDoChat() {
  // Router
  const roteamento = useRouter();
  return (
  <div>
      <Text
        variant="body1"
        styleSheet={{
          marginBottom: "32px",
          color: appConfig.theme.colors.primary[500],
        }}
      >
        Chat do {appConfig.name}! (EM CONSTRUÇÃO!)
      </Text>
      <Button
        // type="submit"
        label="Voltar"
        onClick={function (props) {
                      roteamento.push("/");
                    }}
        fullWidth
        buttonColors={{
          contrastColor: appConfig.theme.colors.neutrals["000"],
          mainColor: appConfig.theme.colors.primary[600],
          mainColorLight: appConfig.theme.colors.primary[500],
          mainColorStrong: appConfig.theme.colors.primary[700],
        }}
      />

  </div>);
}
