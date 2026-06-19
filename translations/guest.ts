// Guest house-guide content. ES = Argentinian, EN = US, PT = Brazilian.
// Cards are inserted with the tokens :::card-electrician | :::card-plumber | :::card-internet
// (language-independent, rendered as React ContactCard in app/guest/GuestContent.tsx).

export const guestTranslations = {
  title: {
    es: "Guía de la casa",
    en: "House guide",
    pt: "Guia da casa",
  },
  subtitle: {
    es: "¡Gracias por quedarte en nuestra casa! Como toda casa, necesita un poco de mantenimiento. Acá tenés una **guía rápida** para resolver lo más común, *en cualquier casa*. Siempre podés escribirnos por el mismo WhatsApp donde reservaste, pero muchas veces la solución está a la vuelta de la esquina. 🔧",
    en: "Thanks for staying in our house! Like any house, it needs a little maintenance. Here's a **quick guide** to handle the most common things, *in any house*. You can always message us on the same WhatsApp where you booked, but often the fix is just around the corner. 🔧",
    pt: "Obrigado por ficar na nossa casa! Como toda casa, ela precisa de manutenção. Aqui está um **guia rápido** para resolver o mais comum, *em qualquer casa*. Você sempre pode nos escrever no mesmo WhatsApp onde reservou, mas muitas vezes a solução está logo ali. 🔧",
  },

  sections: [
    {
      id: "wifi",
      emoji: "📶",
      title: { es: "WiFi", en: "WiFi", pt: "WiFi" },
      content: {
        es: `**Red:** Il Buco
**Contraseña:** terminator2

Una sola red en toda la casa. Conectate a la que tengas más cerca.

**Si no aparece la red:**
- Puede aparecer una red abierta tipo **TP-Link_XXXX**: es nuestro access point cuando se reinicia.
- *dormitorio1* **no es nuestra** ❌

**Si no hay internet:**
Casi siempre es el **cable de fibra óptica**. Escribile al proveedor:

:::card-internet

Tuvieron mal servicio, perdón 😕`,
        en: `**Network:** Il Buco
**Password:** terminator2

One network across the whole house. Connect to the closest one.

**If you can't find the network:**
- An open network like **TP-Link_XXXX** may show up: that's our access point after a reset.
- *dormitorio1* is **not ours** ❌

**If there's no internet:**
It's almost always the **fiber optic cable**. Message the provider:

:::card-internet

They've had bad service, sorry 😕`,
        pt: `**Rede:** Il Buco
**Senha:** terminator2

Uma só rede na casa toda. Conecte-se à mais próxima.

**Se a rede não aparecer:**
- Pode aparecer uma rede aberta tipo **TP-Link_XXXX**: é o nosso ponto de acesso depois de reiniciar.
- *dormitorio1* **não é a nossa** ❌

**Se não houver internet:**
Quase sempre é o **cabo de fibra óptica**. Escreva para o provedor:

:::card-internet

Tiveram um serviço ruim, desculpe 😕`,
      },
    },

    {
      id: "checkin",
      emoji: "🔑",
      title: { es: "Llegada y salida", en: "Arrival and checkout", pt: "Chegada e saída" },
      content: {
        es: `**Entrada:** desde las 15:00. La puerta abre con código, te lo enviamos antes de tu llegada.
**Salida:** hasta las 11:00.

**Antes de irte:**
- Dejá las llaves donde las encontraste.
- Apagá los aires y las luces.
- Cerrá puertas y ventanas.
- Dejá en la casa lo que es de la casa.

¿Llegás antes o te vas más tarde? Escribinos y lo vemos.`,
        en: `**Check-in:** from 3:00 PM. The door opens with a code, we send it before you arrive.
**Check-out:** by 11:00 AM.

**Before you leave:**
- Leave the keys where you found them.
- Turn off the A/C and the lights.
- Close doors and windows.
- Leave the house items in the house.

Arriving earlier or leaving later? Message us and we'll sort it out.`,
        pt: `**Check-in:** a partir das 15:00. A porta abre com código, enviamos antes da sua chegada.
**Check-out:** até as 11:00.

**Antes de sair:**
- Deixe as chaves onde as encontrou.
- Desligue os ar-condicionados e as luzes.
- Feche portas e janelas.
- Deixe na casa o que é da casa.

Chega antes ou sai mais tarde? Escreva pra gente.`,
      },
    },

    {
      id: "climate",
      emoji: "🌡️",
      title: { es: "Aire y calefacción", en: "Heating and cooling", pt: "Ar e aquecimento" },
      content: {
        es: `**Aire acondicionado:** el control tiene dos modos.
- ❄️ copo de nieve = frío
- ☀️ sol = calor

Dejalo entre 22 y 23°, y **apagalo cuando salís**. Es lo que más se confunde.

**Calefacción:** la casa tiene losa radiante. Ajustá la temperatura desde el **termostato**; no hace falta tocar la caldera.

Si algo no enfría o no calienta, escribinos.`,
        en: `**Air conditioning:** the remote has two modes.
- ❄️ snowflake = cool
- ☀️ sun = heat

Keep it between 22 and 23°C, and **turn it off when you go out**. This is the most common mix-up.

**Heating:** the house has underfloor heating. Set the temperature on the **thermostat**; no need to touch the boiler.

If something won't cool or heat, message us.`,
        pt: `**Ar-condicionado:** o controle tem dois modos.
- ❄️ floco de neve = frio
- ☀️ sol = calor

Deixe entre 22 e 23°C e **desligue ao sair**. É o que mais confunde.

**Aquecimento:** a casa tem piso radiante. Ajuste a temperatura no **termostato**; não precisa mexer na caldeira.

Se algo não esfriar ou não aquecer, escreva pra gente.`,
      },
    },

    {
      id: "kitchen",
      emoji: "☕",
      title: { es: "Cocina", en: "Kitchen", pt: "Cozinha" },
      content: {
        es: `**Cafetera:** poné agua, un **filtro de papel** y café. Usá solo filtros de papel, así no se arruina.

**Cortesía:** servite lo que está marcado como cortesía (la canasta de bienvenida, café, té).

Algunas pocas cosas son personales y están etiquetadas. Ante la duda, preguntanos. 🙂`,
        en: `**Coffee maker:** add water, a **paper filter** and coffee. Use paper filters only, so it doesn't burn out.

**Courtesy:** help yourself to anything marked as courtesy (the welcome basket, coffee, tea).

A few things are personal and are labeled. When in doubt, just ask us. 🙂`,
        pt: `**Cafeteira:** coloque água, um **filtro de papel** e café. Use só filtros de papel, assim ela não estraga.

**Cortesia:** sirva-se do que está marcado como cortesia (a cesta de boas-vindas, café, chá).

Algumas poucas coisas são pessoais e estão etiquetadas. Na dúvida, é só perguntar. 🙂`,
      },
    },

    {
      id: "house-items",
      emoji: "🧺",
      title: { es: "Ropa blanca y cosas de la casa", en: "Linens and house items", pt: "Roupa de cama e itens da casa" },
      content: {
        es: `Toallas, sábanas, vajilla, almohadas, ventiladores, la sombrilla y las reposeras del jardín son **de la casa** y quedan para los próximos huéspedes. Por favor, dejá todo al salir.

¿Te falta algo o necesitás uno extra? Escribinos y lo resolvemos.

**Lavarropas:** el jabón va en el cajón izquierdo. Programa normal para la ropa de diario.`,
        en: `Towels, linens, dishes, pillows, the fans, the garden umbrella and the loungers belong to **the house** and stay for the next guests. Please leave everything when you go.

Missing something or need an extra? Message us and we'll handle it.

**Washer:** detergent goes in the left drawer. Normal program for everyday clothes.`,
        pt: `Toalhas, roupa de cama, louça, travesseiros, os ventiladores, o guarda-sol e as espreguiçadeiras do jardim são **da casa** e ficam para os próximos hóspedes. Por favor, deixe tudo ao sair.

Falta algo ou precisa de um extra? Escreva pra gente que a gente resolve.

**Máquina de lavar:** o sabão vai na gaveta esquerda. Programa normal para roupa do dia a dia.`,
      },
    },

    {
      id: "rules",
      emoji: "🤫",
      title: { es: "Normas de la casa", en: "House rules", pt: "Regras da casa" },
      content: {
        es: `- 🚭 No se fuma dentro de la casa.
- 🤫 Silencio de 23:00 a 08:00. Cuidemos a los vecinos.
- 👥 Sin fiestas ni huéspedes extra sin avisar.
- ♻️ Reciclables en su cesto.

Gracias por cuidar la casa como si fuera tuya.`,
        en: `- 🚭 No smoking inside the house.
- 🤫 Quiet hours 11:00 PM to 8:00 AM. Let's look after the neighbours.
- 👥 No parties or extra guests without telling us.
- ♻️ Recyclables in their bin.

Thanks for treating the house as if it were your own.`,
        pt: `- 🚭 Não se fuma dentro da casa.
- 🤫 Silêncio das 23:00 às 08:00. Vamos cuidar dos vizinhos.
- 👥 Sem festas nem hóspedes extras sem avisar.
- ♻️ Recicláveis no cesto certo.

Obrigado por cuidar da casa como se fosse sua.`,
      },
    },

    {
      id: "electricity",
      emoji: "⚡",
      title: { es: "Electricidad", en: "Electricity", pt: "Eletricidade" },
      content: {
        es: `Todo lo eléctrico está en la **sala de máquinas**: bajá al sótano y girá a la derecha dos veces.

- Buscá los **disyuntores caídos** y subilos.
- ⚠️ Si vuelven a saltar, no insistas hasta encontrar la causa.

**Si está mojado afuera:** suele ser agua en una lámpara exterior. Apagá las **luces de afuera** desde el living y probá el disyuntor de nuevo.

Si sigue, llamá a nuestro electricista:

:::card-electrician`,
        en: `Everything electrical is in the **machine room**: go down to the basement and turn right twice.

- Look for **breakers that are down** and switch them back on.
- ⚠️ If they trip again, don't insist until you find the cause.

**If it's wet outside:** it's usually water in an outdoor light fixture. Turn off the **outdoor lights** from the living room and try the breaker again.

If it continues, call our electrician:

:::card-electrician`,
        pt: `Tudo elétrico está na **sala de máquinas**: desça ao porão e vire à direita duas vezes.

- Procure os **disjuntores desligados** e religue-os.
- ⚠️ Se desarmarem de novo, não insista até achar a causa.

**Se estiver molhado lá fora:** costuma ser água numa luminária externa. Desligue as **luzes de fora** pela sala e tente o disjuntor de novo.

Se continuar, chame o nosso eletricista:

:::card-electrician`,
      },
    },

    {
      id: "water",
      emoji: "💧",
      title: { es: "Agua", en: "Water", pt: "Água" },
      content: {
        es: `**Si NO hay agua:** casi siempre es un tema eléctrico, así que es David también.

:::card-electrician

**Si hay EXCESO de agua o mal olor:** es trabajo del plomero.

:::card-plumber`,
        en: `**If there's NO water:** it's almost always an electrical issue, so it's David again.

:::card-electrician

**If there's TOO much water or a bad smell:** that's a plumber's job.

:::card-plumber`,
        pt: `**Se NÃO houver água:** quase sempre é elétrico, então é o David também.

:::card-electrician

**Se houver EXCESSO de água ou mau cheiro:** é trabalho de encanador.

:::card-plumber`,
      },
    },

    {
      id: "safety",
      emoji: "🧯",
      title: { es: "Seguridad", en: "Safety", pt: "Segurança" },
      content: {
        es: `- 🧯 **Matafuego:** en la cocina, señalizado.
- ⛑️ **Botiquín:** en el baño principal.
- 🚨 **Emergencias:** 911 · Bomberos 100 · Emergencia médica 107.

Ante cualquier urgencia, primero ponete a salvo y después escribinos.`,
        en: `- 🧯 **Fire extinguisher:** in the kitchen, marked.
- ⛑️ **First-aid kit:** in the main bathroom.
- 🚨 **Emergencies:** 911 · Fire 100 · Medical 107.

In any emergency, get to safety first and then message us.`,
        pt: `- 🧯 **Extintor:** na cozinha, sinalizado.
- ⛑️ **Kit de primeiros socorros:** no banheiro principal.
- 🚨 **Emergências:** 911 · Bombeiros 100 · Emergência médica 107.

Em qualquer emergência, primeiro coloque-se a salvo e depois escreva pra gente.`,
      },
    },

    {
      id: "contact",
      emoji: "💬",
      title: { es: "¿Algo más?", en: "Anything else?", pt: "Mais alguma coisa?" },
      content: {
        es: `Para todo lo demás, escribinos por el mismo WhatsApp donde reservaste. Respondemos rápido.

¿Buscás qué hacer en Cariló? Mirá nuestras [recomendaciones de playas, restaurantes y paseos](/que-hacer-en-carilo).`,
        en: `For anything else, message us on the same WhatsApp where you booked. We answer fast.

Looking for things to do in Cariló? See our [picks for beaches, restaurants and walks](/en/things-to-do-carilo).`,
        pt: `Para todo o resto, escreva pra gente no mesmo WhatsApp onde reservou. Respondemos rápido.

Procurando o que fazer em Cariló? Veja nossas [dicas de praias, restaurantes e passeios](/pt/o-que-fazer-em-carilo).`,
      },
    },
  ],
}
