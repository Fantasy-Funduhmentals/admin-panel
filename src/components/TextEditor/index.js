import {
  BlockquoteButton,
  BoldButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton,
} from "@draft-js-plugins/buttons";
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import createToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/static-toolbar";
import { convertToHTML } from "draft-convert";
import React, { Component } from "react";
import buttonStyles from "./button.module.scss";
import styles from "./textEditor.module.scss";
import toolbarStyles from "./toolbar.module.scss";

const toolbarPlugin = createToolbarPlugin({
  theme: { buttonStyles, toolbarStyles },
});
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick = () => this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) => (
          // eslint-disable-next-line
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}

class HeadlinesButton extends Component {
  onClick = () => this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className={styles.headlineButtonWrapper}>
        <button onClick={this.onClick} className={styles.headlineButton}>
          H
        </button>
      </div>
    );
  }
}

export default class TextEditor extends Component {
  state = {
    editorState: createEditorStateWithText(""),
  };

  onChange = (editorState) => {
    this.props.onChange(editorState);
    this.setState({ editorState });
  };

  focus = () => {
    this.editor.focus();
  };

  componentDidUpdate(prevProps) {
    console.log("prev", prevProps.value);
    console.log("this", this.props.value);

    if (this.props.value && this.props.value !== prevProps.value) {
      this.setState({ editorState: this.props.value });
      console.log("this", convertToHTML(this.props.value?.getCurrentContent()));
    }
  }

  render() {
    return (
      <div>
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            placeholder="Write here ..."
            ref={(element) => {
              this.editor = element;
            }}
          />
          <Toolbar>
            {(externalProps) => (
              <>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
              </>
            )}
          </Toolbar>
        </div>
      </div>
    );
  }
}
