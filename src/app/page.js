import Image from "next/image";
import styles from "./page.module.css";
import Editor from "./editor";

export default function Home() {
  return (
    <div className={styles.page}>
        <h1>Lexical Editor</h1>
        <Editor />
    </div>
  );
}
