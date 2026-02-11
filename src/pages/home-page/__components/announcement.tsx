import { Star06, XClose } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import * as S from 'src/pages/home-page/home.page.styled.tsx';
import { useAnnouncement } from 'src/pages/home-page/hooks';

const { Text } = Typography;

const Announcement = () => {
  const { announcement, cancelAnnouncement } = useAnnouncement();

  return (
    announcement && (
      <S.AnnouncementSection>
        <S.SectionWrapper>
          <Stack alignment="center" wrap={false}>
            <Stack.Item fill>
              <Stack alignment="center" wrap={false}>
                <div className="announcement-icon">
                  <Star06 />
                </div>

                <Text>
                  <Text strong>{announcement?.title} </Text>
                  <Text type="secondary">{announcement.description}</Text>
                </Text>
              </Stack>
            </Stack.Item>

            {announcement.link && (
              <Stack alignment="center" wrap={false}>
                <Button
                  onClick={() => window.open(announcement.link, '_blank')}
                >
                  Read update
                </Button>
                <Button
                  type="text"
                  icon={<XClose />}
                  onClick={cancelAnnouncement}
                />
              </Stack>
            )}
          </Stack>
        </S.SectionWrapper>
      </S.AnnouncementSection>
    )
  );
};

export default Announcement;
