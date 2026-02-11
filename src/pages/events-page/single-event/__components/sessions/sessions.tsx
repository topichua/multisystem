import { FC } from 'react';
import { Stack } from 'src/components/common/Stack/Stack';
import { CollapseProps } from 'antd';
import {
  SectionCard,
  SectionDescription,
} from '../../single-event.page.styled';
import { SessionRow } from './sessions.styled';
import { CustomCollapse } from 'src/components/common/CustomCollapse/CustomCollapse';
import { Divider } from 'src/components/common/Divider/Divider';
import { SessionsType } from 'src/transport/events/events.dto';
import { formatDate, getTimeRange } from 'src/utils/date-time';
import _first from 'lodash/first';

type GroupedSessionsMapType = Map<string, SessionsType[]>;

type SessionsProps = {
  sessions?: SessionsType[];
  shortDescription?: string;
};
export const Sessions: FC<SessionsProps> = ({
  sessions = [],
  shortDescription,
}) => {
  const getSessionPanelItems = (): {
    items: CollapseProps['items'];
    defaultActiveKey: string;
  } => {
    const grouped: GroupedSessionsMapType = new Map();

    sessions?.forEach((session) => {
      const date = formatDate(session.startDateTime);

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)?.push(session);
    });

    const items: CollapseProps['items'] = Array.from(grouped.entries()).map(
      ([date, sessions], index) => {
        const dayNumber = index + 1;

        return {
          key: date,
          label: `Day ${dayNumber}`,
          children: (
            <Stack vertical>
              {sessions.map((item, index, array) => (
                <>
                  <SessionRow distribution="equalSpacing">
                    <span className="session-text">{item.title}</span>
                    <span className="session-time">
                      {getTimeRange(
                        item.startDateTime,
                        item.startTimeZone,
                        item.endDateTime,
                        item.endTimeZone
                      )}
                    </span>
                  </SessionRow>

                  {array.length > 1 && index < array.length - 1 && (
                    <Divider style={{ marginTop: '12px', marginBottom: '0' }} />
                  )}
                </>
              ))}
            </Stack>
          ),
        };
      }
    );

    const defaultActiveKey = _first(items)?.key?.toLocaleString() ?? '';

    return { items, defaultActiveKey };
  };

  const { items: panelItems, defaultActiveKey: defaultActivePanelKey } =
    getSessionPanelItems();

  return (
    <SectionCard>
      <p>Sessions</p>

      <SectionDescription>
        {!shortDescription && !panelItems?.length ? '-' : shortDescription}
      </SectionDescription>

      <CustomCollapse
        defaultActiveKey={defaultActivePanelKey}
        items={panelItems}
      />
    </SectionCard>
  );
};
