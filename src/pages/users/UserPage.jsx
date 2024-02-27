import {
  Avatar,
  Button,
  ButtonGroup,
  Heading,
  Stack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel, CircularProgress,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import {useEffect, useMemo, useState} from 'react';
import {getUserService, followService, getUserPostsService} from '../../services/usersServices';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/authSelectors';
import UserPosts from '../../components/users/UserPosts';
import PostsList from "../../components/posts/PostsList.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {usePosts} from "../../hooks/usePosts.js";
import LikedPosts from "../../components/posts/LikedPosts.jsx";

function UserPage() {
  const { userId } = useParams();

  const authUser = useSelector(selectUser);

  const [user, setUser] = useState(null);

  const isAuthUser = authUser.id === Number(userId);

  useEffect(() => {
    getUserService(userId).then((data) => setUser(data));
  }, [userId]);

  function follow() {
    followService(userId).then((newUser) => setUser(newUser));
  }
  const params = useMemo(() => {
    return {
      userId,
    };
  }, [userId]);

  const { likedPosts, activePage, hasMore, fetchPosts, likePost, deletePost } =
      usePosts(getUserPostsService, params);

  return (
    <div>
      {user && (
        <Stack alignItems="center" gap="12px">
          <Avatar
            src={user.avatar || undefined}
            name={user.username}
            size="xl"
          />

          <Stack gap="4px" textAlign="center">
            <Heading as="h1" size="md">
              {user.fullName}
            </Heading>
            <Text as="span" color="gray.500" fontWeight={500}>
              @{user.username}
            </Text>
            {user.bio && <Text>{user.bio}</Text>}
          </Stack>

          <ButtonGroup size="sm" variant="ghost">
            <Button>Followers {user._count.followers}</Button>
            <Button>Following {user._count.following}</Button>
          </ButtonGroup>

          {!isAuthUser && (
            <Button
              colorScheme="blue"
              variant={user.isFollowing ? 'outline' : 'solid'}
              onClick={follow}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}

          <Tabs width="100%" isFitted>
            <TabList>
              <Tab>Posts</Tab>
              <Tab>Likes</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <UserPosts userId={userId} />
              </TabPanel>
              <TabPanel>
               <LikedPosts userId={userId}/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      )}
    </div>
  );
}

export default UserPage;
