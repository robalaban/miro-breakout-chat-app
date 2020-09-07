import { APP_ID } from '../config';
import appIcon from './icon';
import loadBreakoutWidgets from './helpers'

const initChat = async (breakoutChatRoomId: string) => {
  const breakoutWidgets = await loadBreakoutWidgets();
  await miro.__setRuntimeState({
    'breakoutWidgets': breakoutWidgets,
    [APP_ID]: { breakoutChatRoomId }
  });

  miro.board.ui.closeLeftSidebar();
  miro.board.ui.openLeftSidebar('/chat');
};

const handleAddChatClick = async () => {
  const viewport = await miro.board.viewport.get();

  const widget = (
    await miro.board.widgets.create({
      type: 'SHAPE',
      text: 'click to join a breakout chat',
      width: 300,
      style: {
        shapeType: 6,
        backgroundColor: '#fff',
        fontFamily: miro.enums.fontFamily.PERMANENT_MARKER,
        borderWidth: 7,
      },
      metadata: {
        [APP_ID]: {
          isBreakoutChatButton: true,
        },
      },
      x: viewport.x + viewport.width / 2,
      y: viewport.y + viewport.height / 2,
    })
  )[0];

  // @ts-ignore
  miro.board.viewport.zoomToObject(widget);

  initChat(widget.id);
};

const initPlugin = async () => {
  const breakoutWidgets = await loadBreakoutWidgets();
  await miro.__setRuntimeState({'breakoutWidgets': breakoutWidgets});

  // @ts-ignore
  miro.addListener(miro.enums.event.SELECTION_UPDATED, async () => {
    const widgets = await miro.board.selection.get();
    if (
      widgets.length === 1 &&
      widgets[0].metadata[APP_ID]?.isBreakoutChatButton
    ) {
      initChat(widgets[0].id);
    }
  });

  // @ts-ignore
  miro.addListener(miro.enums.event.WIDGETS_DELETED, async (widget) => {
    const state = await miro.__getRuntimeState();
    if (state.breakoutWidgets.includes(widget.data[0].id)) {
      miro.board.ui.closeLeftSidebar();
      await loadBreakoutWidgets();
    }
  });

  await miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Create a new breakout chat',
        svgIcon: appIcon,
        onClick: handleAddChatClick,
      },
    },
  });
};

miro.onReady(async () => {
  const authorized = await miro.isAuthorized();
  if (authorized) {
    await initPlugin();
  } else {
    const res = await miro.board.ui.openModal('not-authorized.html');
    if (res === 'success') {
      initPlugin();
    }
  }
});
