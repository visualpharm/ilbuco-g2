import { test } from "node:test"
import assert from "node:assert/strict"
import loader from "./imagekit-loader"

test("local photos go through ImageKit at the requested width", () => {
  assert.equal(loader({ src: "/gallery/hero-villa-exterior.jpeg", width: 828 }), "https://ik.imagekit.io/icons8/ilbuco/gallery/hero-villa-exterior.jpeg?tr=w-828,q-75")
  assert.equal(loader({ src: "/photo/living/File 24-04-2025, 10 29 16 PM-Edit.jpg", width: 640 }), "https://ik.imagekit.io/icons8/ilbuco/photo/living/File%2024-04-2025,%2010%2029%2016%20PM-Edit.jpg?tr=w-640,q-75")
})

test("icons, svg and remote images stay as they are", () => {
  assert.equal(loader({ src: "/icons/icons8/close.png", width: 48 }), "/icons/icons8/close.png")
  assert.equal(loader({ src: "/favicon.svg", width: 48 }), "/favicon.svg")
  assert.equal(loader({ src: "https://example.com/a.png", width: 48 }), "https://example.com/a.png")
})
