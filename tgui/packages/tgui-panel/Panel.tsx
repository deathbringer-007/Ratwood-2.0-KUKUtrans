/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import React from 'react';
import { Pane } from 'tgui/layouts';
import { Box, Button, Section, Stack } from 'tgui-core/components';

import { NowPlayingWidget, useAudio } from './audio';
import { ChatPanel, ChatTabs } from './chat';
import { useGame } from './game';
import { Notifications } from './Notifications';
import { PingIndicator } from './ping';
import { ReconnectButton } from './reconnect';
import { SettingsPanel, useSettings } from './settings';

export const Panel = (props) => {
  const audio = useAudio();
  const settings = useSettings();
  const game = useGame();
  const [showFormattingHelp, setShowFormattingHelp] = React.useState(false);
  if (process.env.NODE_ENV !== 'production') {
    const { useDebug, KitchenSink } = require('tgui/debug');
    const debug = useDebug();
    if (debug.kitchenSink) {
      return <KitchenSink panel />;
    }
  }

  // Formatting help content
  const formattingHelp = (
    <Box p={2}>
      <h2>Formatting Help</h2>
      <ul>
        <li><b>**bold**</b> → <b>bold</b></li>
        <li><i>*italics*</i> → <i>italics</i></li>
        <li><span style={{ fontFamily: 'monospace' }}># Header</span> → <b>Header</b></li>
        <li><span style={{ fontFamily: 'monospace' }}>((small))</span> → <span style={{ fontSize: 'smaller' }}>small</span></li>
        <li><span style={{ fontFamily: 'monospace' }}>&lt;color=862F20&gt;text&lt;/color&gt;</span> → <span style={{ color: '#862F20' }}>text</span></li>
        <li><span style={{ fontFamily: 'monospace' }}>* Bullet</span> → • Bullet</li>
        <li><span style={{ fontFamily: 'monospace' }}>&lt;br&gt;</span> → line break</li>
        <li><span style={{ fontFamily: 'monospace' }}>&lt;b&gt;text&lt;/b&gt;</span> → <b>text</b></li>
        <li><span style={{ fontFamily: 'monospace' }}>&lt;i&gt;text&lt;/i&gt;</span> → <i>text</i></li>
      </ul>
      <Button color="average" onClick={() => setShowFormattingHelp(false)}>
        Close
      </Button>
    </Box>
  );

  return (
    <Pane theme="dark">
      <Stack fill vertical>
        <Stack.Item fontSize={1.2}>
          <Section fitted>
            <Stack mr={1} align="center">
              <Stack.Item grow overflowX="auto">
                <ChatTabs />
              </Stack.Item>
              <Stack.Item>
                <Button
                  icon="question-circle"
                  color="average"
                  tooltip="Formatting Help"
                  tooltipPosition="bottom-start"
                  onClick={() => setShowFormattingHelp(true)}
                >
                  Formatting Help
                </Button>
              </Stack.Item>
              <Stack.Item>
                <PingIndicator />
              </Stack.Item>
              <Stack.Item>
                <Button
                  color="grey"
                  selected={audio.visible}
                  icon="music"
                  tooltip="Music player"
                  tooltipPosition="bottom-start"
                  onClick={() => audio.toggle()}
                />
              </Stack.Item>
              <Stack.Item>
                <Button
                  icon={settings.visible ? 'times' : 'cog'}
                  selected={settings.visible}
                  tooltip={
                    settings.visible ? 'Close settings' : 'Open settings'
                  }
                  tooltipPosition="bottom-start"
                  onClick={() => settings.toggle()}
                />
              </Stack.Item>
            </Stack>
          </Section>
        </Stack.Item>
        {showFormattingHelp && (
          <Stack.Item>
            <Section>
              {formattingHelp}
            </Section>
          </Stack.Item>
        )}
        {audio.visible && (
          <Stack.Item fontSize={1.2}>
            <Section>
              <NowPlayingWidget />
            </Section>
          </Stack.Item>
        )}
        {settings.visible && (
          <Stack.Item fontSize={1.2}>
            <SettingsPanel />
          </Stack.Item>
        )}
        <Stack.Item grow>
          <Section fill fitted position="relative">
            <Pane.Content scrollable>
              <ChatPanel lineHeight={settings.lineHeight} />
            </Pane.Content>
            <Notifications>
              {game.connectionLostAt && (
                <Notifications.Item rightSlot={<ReconnectButton />}>
                  You are either AFK, experiencing lag or the connection has
                  closed.
                </Notifications.Item>
              )}
              {game.roundRestartedAt && (
                <Notifications.Item>
                  The connection has been closed because the server is
                  restarting. Please wait while you automatically reconnect.
                </Notifications.Item>
              )}
            </Notifications>
          </Section>
        </Stack.Item>
      </Stack>
    </Pane>
  );
};
