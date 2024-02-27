import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Stack,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IoMdExit } from 'react-icons/io';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { logoutAction } from '../redux/auth/authActions.js';
import React from 'react';
import { FaArrowTrendUp, FaHouse } from 'react-icons/fa6';
import { FaPlusCircle } from 'react-icons/fa';
import {selectUser} from "../redux/auth/authSelectors.js";

export default function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelLogoutBtnRef = React.useRef();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  return (
      <>
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelLogoutBtnRef}
            onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Logout?
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelLogoutBtnRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                    colorScheme="red"
                    onClick={() => {
                      dispatch(logoutAction());
                      onClose();
                    }}
                    ml={3}
                >
                  Logout
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Flex
            justifyContent={'space-between'}
            mb={'10px'}
            alignItems={'end'}
        >
          <Heading>Blog</Heading>
          <ButtonGroup>
            <IconButton
                icon={
                  colorMode === 'light' ? <MoonIcon /> : <SunIcon />
                }
                aria-label={'Toggle theme'}
                variant={'ghost'}
                onClick={toggleColorMode}
            />
            <IconButton
                icon={<IoMdExit />}
                aria-label={'Logout'}
                variant={'ghost'}
                colorScheme={'red'}
                onClick={onOpen}
            />
          </ButtonGroup>
        </Flex>
        <Stack gap={'4px'}>
          <NavigationLink to={'/feed'} iconComponent={<FaHouse />}>
            Feed
          </NavigationLink>
          <NavigationLink
              to={'/trending'}
              iconComponent={<FaArrowTrendUp />}
          >
            Trending
          </NavigationLink>
          <NavigationLink to={`/users/${user.id}`}>
            {user.username}
          </NavigationLink>
          <NavigationLink
              to={'/create-post'}
              iconComponent={<FaPlusCircle />}
          >
            Create Post
          </NavigationLink>
        </Stack>
      </>
  );
}

function NavigationLink({ children, iconComponent, ...props }) {
  return (
      <Button
          as={NavLink}
          justifyContent={'start'}
          borderRadius={'xl'}
          variant={'ghost'}
          fontSize={'lg'}
          sx={{
            '&.active': {
              bgColor: 'rgba(60,139,199,0.1)',
            },
            '&.active:hover': {
              bgColor: 'rgba(60,139,199,0.2)',
            },
          }}
          {...props}
      >
        <Flex gap={'6px'} alignItems={'center'}>
          {iconComponent}
          {children}
        </Flex>
      </Button>
  );
}

NavigationLink.propTypes = {
  children: PropTypes.node.isRequired,
  iconComponent: PropTypes.node,
};
