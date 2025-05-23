import { Translate } from "@/components/translate"

export function WelcomeMessage() {
  return (
    <h1>
      <Translate
        text={{
          es: "¡Bienvenido a IL BUCO!",
          en: "Welcome to IL BUCO!",
        }}
      />
    </h1>
  )
}
