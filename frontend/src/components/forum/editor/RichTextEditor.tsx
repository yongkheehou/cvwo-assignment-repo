import { Lock, LockOpen, TextFields } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  TableBubbleMenu,
  type RichTextEditorRef,
} from 'mui-tiptap';
import EditorControls from './EditorControls';
import useExtensions from './useExtensions';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setSubmittedContent: Dispatch<SetStateAction<string>>;
  content: string | undefined;
}

export default function Editor({ setSubmittedContent, content }: Props) {
  const extensions = useExtensions({
    placeholder: 'Thread content',
  });
  const rteRef = useRef<RichTextEditorRef>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [showMenuBar, setShowMenuBar] = useState(true);

  return (
    <>
      <Box
        sx={{
          // An example of how editor styles can be overridden. In this case,
          // setting where the scroll anchors to when jumping to headings. The
          // scroll margin isn't built in since it will likely vary depending on
          // where the editor itself is rendered (e.g. if there's a sticky nav
          // bar on your site).
          '& .ProseMirror': {
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              scrollMarginTop: showMenuBar ? 50 : 0,
            },
          },
          overflow: 'auto',
          maxHeight: '75%',
        }}
      >
        <RichTextEditor
          ref={rteRef}
          extensions={extensions}
          content={content}
          onUpdate={() => {
            setSubmittedContent(rteRef.current?.editor?.getHTML() ?? '');
            console.log(rteRef.current?.editor?.getHTML() ?? '');
          }}
          editable={isEditable}
          renderControls={() => <EditorControls />}
          RichTextFieldProps={{
            // The "outlined" variant is the default (shown here only as
            // example), but can be changed to "standard" to remove the outlined
            // field border from the editor
            variant: 'outlined',
            MenuBarProps: {
              hide: !showMenuBar,
            },
            // Below is an example of adding a toggle within the outlined field
            // for showing/hiding the editor menu bar, and a "submit" button for
            // saving/viewing the HTML content
            footer: (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  borderTopStyle: 'solid',
                  borderTopWidth: 1,
                  borderTopColor: (theme) => theme.palette.divider,
                  py: 1,
                  px: 1.5,
                }}
              >
                <MenuButton
                  value="formatting"
                  tooltipLabel={
                    showMenuBar ? 'Hide formatting' : 'Show formatting'
                  }
                  size="small"
                  onClick={() =>
                    setShowMenuBar((currentState) => !currentState)
                  }
                  selected={showMenuBar}
                  IconComponent={TextFields}
                />

                <MenuButton
                  value="formatting"
                  tooltipLabel={
                    isEditable
                      ? 'Prevent edits (use read-only mode)'
                      : 'Allow edits'
                  }
                  size="small"
                  onClick={() => setIsEditable((currentState) => !currentState)}
                  selected={!isEditable}
                  IconComponent={isEditable ? Lock : LockOpen}
                />
              </Stack>
            ),
          }}
        >
          {() => (
            <>
              <LinkBubbleMenu />
              <TableBubbleMenu />
            </>
          )}
        </RichTextEditor>
      </Box>
    </>
  );
}
