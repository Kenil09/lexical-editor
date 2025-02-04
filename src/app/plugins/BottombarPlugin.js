/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {

  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useRef} from 'react';


function Divider() {
  return <div className="divider" />;
}

export default function BottombarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  return (
    <div className="toolbar bottombar" ref={toolbarRef}>
        hello
    </div>
  );
}