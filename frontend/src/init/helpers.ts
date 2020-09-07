import { APP_ID } from '../config';

const loadBreakoutWidgets = async () => {
    
    let state = []
    const boardObjects = await miro.board.widgets.get();

    //@ts-ignore
    state = boardObjects.reduce((acc, cur) => {
        if (cur.metadata[APP_ID]?.isBreakoutChatButton) {
            acc.push(cur.id)
        }
        return acc
    }, [])

    return state
}

export default loadBreakoutWidgets;
