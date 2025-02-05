/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isOrderedListActive, setIsOrderedListActive] = useState(false);
  const [isUnorderedListActive, setIsUnorderedListActive] = useState(false);
  
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const anchorNode = selection.anchor.getNode();
      const nearestListNode = $getNearestNodeOfType(anchorNode, ListNode);
      if (nearestListNode) {
        setIsOrderedListActive(nearestListNode.getTag() === "ol");
        setIsUnorderedListActive(nearestListNode.getTag() === "ul");
      } else {
        setIsOrderedListActive(false);
        setIsUnorderedListActive(false);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  const handleListChange = (listType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const nearestListNode = $getNearestNodeOfType(anchorNode, ListNode);

        if ($isListNode(nearestListNode)) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          if (listType === INSERT_UNORDERED_LIST_COMMAND && nearestListNode.getTag() === "ol") {
            editor.dispatchCommand(listType, undefined);
          } else if (listType === INSERT_ORDERED_LIST_COMMAND && nearestListNode.getTag() === "ul") {
            editor.dispatchCommand(listType, undefined);
          }
          return;
        } else {
          editor.dispatchCommand(listType, undefined);
        }
      }
    });
  };

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`toolbar-item spaced ${isBold ? "active" : ""}`}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`toolbar-item spaced ${isItalic ? "active" : ""}`}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={`toolbar-item spaced ${isUnderline ? "active" : ""}`}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        className={`toolbar-item spaced ${isStrikethrough ? "active" : ""}`}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>

      {/* UNORDERED LIST BUTTON */}
      <button
        onClick={() => handleListChange(INSERT_UNORDERED_LIST_COMMAND)}
        className={`toolbar-item spaced ${isUnorderedListActive ? "active" : ""}`}
        aria-label="Toggle Unordered List"
      >
        <i className="format ul" />
      </button>

      {/* ORDERED LIST BUTTON */}
      <button
        onClick={() => handleListChange(INSERT_ORDERED_LIST_COMMAND)}
        className={`toolbar-item spaced ${isOrderedListActive ? "active" : ""}`}
        aria-label="Toggle Ordered List"
      >
        <i className="format ol" />
      </button>

      <button
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertText("@");
            }
          });
        }}
        className="toolbar-item spaced"
        aria-label="Insert At Symbol"
      >
        <i className="format at-symbol" />
      </button>
    </div>
  );
}
