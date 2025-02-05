/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useRef } from "react";

function Divider() {
  return <div className="divider" />;
}

export default function BottombarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  return (
    <div className="toolbar bottombar" ref={toolbarRef}>
      <button className="toolbar-item spaced" aria-label="Import File">
        <i className="format paperclip" /> {/* Add appropriate icon */}
      </button>
      <button className="toolbar-item spaced" aria-label="Add Emoji">
        <i className="format smile" /> {/* Add appropriate icon */}
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const textNode = $createTextNode("@");
              selection.insertNodes([textNode]);
            }
          });
        }}
        className="toolbar-item spaced"
        aria-label="Insert At Symbol"
      >
        <i className="format at-symbol" /> {/* Add appropriate icon */}
      </button>
      <button className="toolbar-item spaced" aria-label="Invite users">
        <i className="format invite" /> {/* Add appropriate icon */}
      </button>
    </div>
  );
}
