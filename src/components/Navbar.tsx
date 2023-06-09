import { useEffect, useState, } from 'react';
import { createStyles, Navbar, Group, Code, getStylesRef, rem, Image } from '@mantine/core';
import {
  Home,
  MessageCircle2,
  MessageChatbot,
  MoodSmileBeam,
  SwitchHorizontal,
  Logout,
  UserCircle
} from 'tabler-icons-react';
import Link from 'next/link'
import Router,{useRouter} from 'next/router'
import { useAuth } from "../components/auth/AuthUserProvider"
import { signInWithGoogle, signOut } from "../../util/firebase"

const useStyles = createStyles((theme) => ({
  fixedNavbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    marginBottom: theme.spacing.lg,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}));

const data = [
  { link: '/', label: 'Home', icon: Home },
  { link: '/CreatePost', label: 'Post', icon: MessageCircle2 },
  { link: '/Profile', label: 'Profile', icon: UserCircle },
];

export default function NavbarSimple() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(data[0].label);
  const router = useRouter()
  const { user } = useAuth();

  const { displayName, email, photoURL } = user || {};
  useEffect(() => {
    const handleRouteChange = () => {
      const path = router.pathname;
      const label = data.find((item) => item.link === path)?.label;
      if (label) {
        setActive(label);
      }
    };

    handleRouteChange(); 

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.pathname]);
  const links = data.map((item) => (
    <Link href={item.link} key={item.label} className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      onClick={(event) => {
        event.preventDefault();
        router.push(item.link)
      }}
    >
      <item.icon className={classes.linkIcon} strokeWidth={1.5} />
      <span>{item.label}</span>
    </Link>
  ));
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar className={classes.fixedNavbar} width = {{sm:400}} p="md" >
      <Navbar.Section grow>
        <Group className={classes.header} >
          <MessageChatbot size={28} />
          <span style = {{fontWeight:'bold',fontSize:'24px'}}>ChatBox</span>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        { user ? 
        <div className = "flex items-center gap-4 p-3 border-2 rounded-lg border-gray-200 mb-4">

{photoURL && (
                <img
                  className=" p-1 w-12 h-12 rounded-full"
                  src={photoURL}
                  alt="Profile Picture"
                />
              )}
          
          <div className = "flex flex-col">
            <span className = "font-bold text-xl">{displayName}</span>
            <span className = "text-sm text-gray-500">{email}</span>
          </div>
        </div>: <></>}
        <button onClick = {user ? signOut : signInWithGoogle}>
          <div className = "flex items-center gap-3 p-3 border-2 rounded-xl border-gray-200 hover:bg-gray-100">
            <img className = "w-6 h-6" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"/>
            <span className = " font-semibold">{user ? "Sign Out of Google" : "Sign In with Google"}</span>
          </div>
        </button>
      
      </Navbar.Section>
    </Navbar>
    </div>
    
  );
}