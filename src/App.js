import React, { createContext, useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import {
  FaUserCircle,
  FaFutbol,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCog,
  FaStar,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

// --- 1. Global Styles ---
const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #121212;
    color: #e0e0e0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: transparent;
    color: inherit;
    font-family: 'Poppins', sans-serif;
  }
`;

// --- 2. Mock Data ---
const initialTurfs = [
  {
    id: "turf-1",
    name: "Green Field Turf",
    location: "123 Sport St, Cityville",
    pricePerHour: 1500,
    availableHours: [
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
    ],
    imageUrl: "https://www.amillan.co.uk/wp-content/uploads/2019/04/shutterstock_1097678441-scaled.jpg",
    description: "A state-of-the-art turf perfect for football and cricket. Features floodlights for night games.",
  },
  {
    id: "turf-2",
    name: "Silver Golf Course",
    location: "456 Central Ave, Townburg",
    pricePerHour: 1200,
    availableHours: [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
    ],
    imageUrl: "https://www.coghillgolf.com/images/slideshows/0087_Course4_9th_hole.jpg",
    description: "Versatile turf suitable for various sports, with easy access and ample parking.",
  },
  {
    id: "turf-3",
    name: "Camp Nou Field",
    location: "789 Stadium Rd, Metro City",
    pricePerHour: 1800,
    availableHours: [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
      "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
    ],
    imageUrl: "https://thumbs.dreamstime.com/b/illuminated-stadium-night-football-field-green-grass-nighttime-view-empty-soccer-brightly-lit-stands-lush-ready-361013016.jpg",
    description: "Premium turf with excellent facilities, ideal for professional training and matches.",
  },
  {
    id: "turf-4",
    name: "Green Field Turf",
    location: "123 Sport St, Cityville",
    pricePerHour: 1600,
    availableHours: [
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
    ],
    imageUrl: "https://thumbs.dreamstime.com/b/indoor-cricket-stadium-newly-opened-indoor-stadium-night-time-160852405.jpg",
    description: "A state-of-the-art turf perfect for football and cricket. Features floodlights for night games.",
  },
  {
    id: "turf-5",
    name: "Basketball Court",
    location: "456 Central Ave, Townburg",
    pricePerHour: 900,
    availableHours: [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
    ],
    imageUrl: "https://images.pexels.com/photos/9739470/pexels-photo-9739470.jpeg",
    description: "Versatile turf suitable for various sports, with easy access and ample parking.",
  },
  {
    id: "turf-6",
    name: "Eagletown Pool",
    location: "789 Stadium Rd, Metro City",
    pricePerHour: 2500,
    availableHours: [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
      "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
    ],
    imageUrl: "https://themagic5.com/cdn/shop/articles/Olympic_028472a0-6451-4834-bbea-bcd329488857.jpg?v=1752149414",
    description: "Premium turf with excellent facilities, ideal for professional training and matches.",
  },
];

const initialUsers = [
  { id: "user-1", name: "Player One", email: "playerone@example.com", contactNo: "9876543210", dob: "15/05/1995", role: "player" },
  { id: "admin-1", name: "Turf Owner", email: "admin@example.com", contactNo: "9123456789", dob: "10/03/1980", role: "admin" },
];

const initialBookings = [
  {
    id: uuidv4(),
    turfId: "turf-1",
    date: "2025-07-25",
    timeSlot: "10:00",
    userId: "user-1",
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: uuidv4(),
    turfId: "turf-2",
    date: "2025-07-26",
    timeSlot: "14:00",
    userId: "user-1",
    status: "pending",
    paymentStatus: "unpaid",
  },
  {
    id: uuidv4(),
    turfId: "turf-1",
    date: "2025-07-27",
    timeSlot: "18:00",
    userId: "user-1",
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: uuidv4(),
    turfId: "turf-3",
    date: "2025-07-25",
    timeSlot: "11:00",
    userId: "admin-1",
    status: "blocked",
    paymentStatus: "N/A",
    notes: "Maintenance",
  },
];

const initialReviews = [
  {
    id: uuidv4(),
    turfId: "turf-1",
    userId: "user-1",
    rating: 4,
    comment: "Great turf with excellent lighting. Could use better parking.",
    date: "2025-07-20",
  },
  {
    id: uuidv4(),
    turfId: "turf-2",
    userId: "user-1",
    rating: 3,
    comment: "Good for casual games, but the surface needs maintenance.",
    date: "2025-07-22",
  },
];

// --- 3. Context API for State Management ---
const TurfContext = createContext();

const TurfProvider = ({ children }) => {
  const [turfs, setTurfs] = useState(initialTurfs);
  const [bookings, setBookings] = useState(initialBookings);
  const [users, setUsers] = useState(initialUsers);
  const [reviews, setReviews] = useState(initialReviews);
  const [currentUser, setCurrentUser] = useState(null); // Start with no user logged in

  const addBooking = (newBooking) => {
    setBookings((prevBookings) => [
      ...prevBookings,
      { ...newBooking, id: uuidv4() },
    ]);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const blockSlot = (turfId, date, timeSlot, notes = "Blocked by Admin") => {
    const existingBlock = bookings.find(
      (b) =>
        b.turfId === turfId &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status === "blocked"
    );
    if (existingBlock) {
      console.log("Slot already blocked.");
      return;
    }
    addBooking({
      turfId,
      date,
      timeSlot,
      userId: currentUser?.id || "admin-1",
      status: "blocked",
      paymentStatus: "N/A",
      notes,
    });
  };

  const unblockSlot = (turfId, date, timeSlot) => {
    setBookings((prevBookings) =>
      prevBookings.filter(
        (b) =>
          !(
            b.turfId === turfId &&
            b.date === date &&
            b.timeSlot === timeSlot &&
            b.status === "blocked"
          )
      )
    );
  };

  const addReview = (newReview) => {
    setReviews((prevReviews) => [
      ...prevReviews,
      { ...newReview, id: uuidv4(), date: new Date().toISOString().split("T")[0] },
    ]);
  };

  const registerUser = (userData) => {
    const newUser = {
      id: uuidv4(),
      role: "player",
      ...userData,
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setCurrentUser(newUser);
  };

  const signInUser = (email, contactNo) => {
    const user = users.find(
      (u) => u.email === email && u.contactNo === contactNo
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  return (
    <TurfContext.Provider
      value={{
        turfs,
        bookings,
        users,
        reviews,
        currentUser,
        setCurrentUser,
        addBooking,
        updateBookingStatus,
        blockSlot,
        unblockSlot,
        addReview,
        registerUser,
        signInUser,
      }}
    >
      {children}
    </TurfContext.Provider>
  );
};

// --- 4. Reusable Components ---

const StyledButton = styled.button`
  background-color: #e50914;
  color: white;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  &:hover {
    background-color: #c00c11;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Button = ({ children, onClick, disabled, type = "button" }) => (
  <StyledButton onClick={onClick} disabled={disabled} type={type}>
    {children}
  </StyledButton>
);

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-size: 16px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const Input = ({ type = "text", placeholder, value, onChange, name }) => (
  <StyledInput
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    name={name}
  />
);

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #e0e0e0;
  }
`;

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

const HeaderContainer = styled.header`
  background-color: #1a1a1a;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #e50914;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 30px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #e0e0e0;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s ease;
  &:hover {
    color: #e50914;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`;

const UserAvatar = styled(FaUserCircle)`
  font-size: 30px;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #e50914;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  @media (max-width: 480px) {
    display: none;
  }
`;

const RoleToggle = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: #2a2a2a;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 1001;
`;

const RoleOption = styled.button`
  padding: 8px 15px;
  border-radius: 5px;
  color: ${(props) => (props.isActive ? "#e50914" : "#e0e0e0")};
  background-color: ${(props) => (props.isActive ? "#3a3a3a" : "transparent")};
  &:hover {
    background-color: #333;
  }
`;

const Header = () => {
  const { currentUser, setCurrentUser, users } = useContext(TurfContext);
  const [showRoleToggle, setShowRoleToggle] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (user) => {
    setCurrentUser(user);
    setShowRoleToggle(false);
    navigate("/");
  };

  return (
    <HeaderContainer>
      <Logo to="/">TurfBook</Logo>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        {currentUser?.role === "player" && (
          <NavLink to="/my-bookings">My Bookings</NavLink>
        )}
        {currentUser?.role === "admin" && (
          <NavLink to="/admin">Admin Dashboard</NavLink>
        )}
        {!currentUser && <NavLink to="/register">Register/Sign In</NavLink>}
      </NavLinks>
      {currentUser ? (
        <UserSection>
          <UserName>
            {currentUser.name} ({currentUser.role})
          </UserName>
          <UserAvatar onClick={() => setShowRoleToggle(!showRoleToggle)} />
          {showRoleToggle && (
            <RoleToggle>
              {users.map((user) => (
                <RoleOption
                  key={user.id}
                  onClick={() => handleRoleChange(user)}
                  isActive={currentUser.id === user.id}
                >
                  {user.name} ({user.role})
                </RoleOption>
              ))}
            </RoleToggle>
          )}
        </UserSection>
      ) : (
        <UserSection>
          <NavLink to="/register">Sign In</NavLink>
        </UserSection>
      )}
    </HeaderContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: #888;
  padding: 20px 20px;
  text-align: center;
  font-size: 14px;
  margin-top: 40px;
  width: 100%;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
  a {
    color: #888;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: #e0e0e0;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLinks>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
      </FooterLinks>
      <p>© {new Date().getFullYear()} TurfBook. All rights reserved.</p>
    </FooterContainer>
  );
};

const TurfCardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease-in-out;
  width: 100%;
  &:hover {
    transform: translateY(-5px);
  }
`;

const TurfImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const TurfInfo = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TurfName = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #e0e0e0;
`;

const TurfLocation = styled.p`
  font-size: 15px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TurfPrice = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #e50914;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TurfCard = ({ turf }) => {
  return (
    <TurfCardContainer to={`/turf/${turf.id}`}>
      <TurfImage src={turf.imageUrl} alt={turf.name} />
      <TurfInfo>
        <TurfName>{turf.name}</TurfName>
        <TurfLocation>
          <FaMapMarkerAlt /> {turf.location}
        </TurfLocation>
        <TurfPrice>
          <FaRupeeSign /> {turf.pricePerHour} / hour
        </TurfPrice>
      </TurfInfo>
    </TurfCardContainer>
  );
};

const BookingCardContainer = styled.div`
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const BookingTitle = styled.h3`
  font-size: 20px;
  color: #e0e0e0;
  margin-bottom: 5px;
`;

const BookingDetail = styled.p`
  font-size: 16px;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: ${(props) => {
    switch (props.status) {
      case "confirmed":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "rejected":
        return "#dc3545";
      case "blocked":
        return "#6c757d";
      default:
        return "#007bff";
    }
  }};
`;

const BookingCard = ({ booking, turfName }) => {
  const { currentUser } = useContext(TurfContext);
  const isBlockedSlot = booking.status === "blocked";

  return (
    <BookingCardContainer>
      <BookingTitle>{turfName}</BookingTitle>
      <BookingDetail>
        <FaCalendarAlt /> {booking.date}
      </BookingDetail>
      <BookingDetail>
        <FaClock /> {booking.timeSlot}
      </BookingDetail>
      {!isBlockedSlot && (
        <>
          <BookingDetail>
            Status: <StatusBadge status={booking.status}>{booking.status}</StatusBadge>
          </BookingDetail>
          <BookingDetail>
            Payment: <StatusBadge status={booking.paymentStatus}>{booking.paymentStatus}</StatusBadge>
          </BookingDetail>
        </>
      )}
      {isBlockedSlot && (
        <BookingDetail>
          Reason: <StatusBadge status="blocked">{booking.notes || "Maintenance"}</StatusBadge>
        </BookingDetail>
      )}
    </BookingCardContainer>
  );
};

const SectionTitleWrapper = styled.div`
  margin-bottom: 30px;
  text-align: left;
  padding-left: 10px;
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const SectionTitleStyled = styled.h2`
  font-size: 2.5em;
  font-weight: 700;
  color: #e0e0e0;
  position: relative;
  display: inline-block;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 60px;
    height: 4px;
    background-color: #e50914;
    border-radius: 2px;
  }
  @media (max-width: 768px) {
    font-size: 2em;
    &:after {
      width: 40px;
      height: 3px;
      bottom: -5px;
    }
  }
  @media (max-width: 480px) {
    font-size: 1.8em;
  }
`;

const SectionTitle = ({ title }) => {
  return (
    <SectionTitleWrapper>
      <SectionTitleStyled>{title}</SectionTitleStyled>
    </SectionTitleWrapper>
  );
};

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const NavArrow = styled.button`
  background: none;
  border: none;
  color: #e50914;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #c00c11;
  }
`;

const CurrentMonthYear = styled.h3`
  font-size: 24px;
  color: #e0e0e0;
`;

const DaysOfWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  text-align: center;
  font-weight: 600;
  color: #888;
  margin-bottom: 10px;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  width: 100%;
`;

const DayCell = styled.div`
  padding: 10px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.isToday ? "#3a3a3a" : props.isSelected ? "#e50914" : "#2a2a2a"};
  color: ${(props) => (props.isInactive ? "#555" : "#e0e0e0")};
  cursor: ${(props) => (props.isInactive ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
  font-weight: ${(props) => (props.isSelected ? "700" : "normal")};
  &:hover {
    background-color: ${(props) =>
      props.isInactive ? "#2a2a2a" : props.isSelected ? "#e50914" : "#3a3a3a"};
  }
`;

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const Calendar = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const formatDate = (year, month, day) => {
    const d = new Date(year, month, day);
    return d.toISOString().split("T")[0];
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavArrow onClick={handlePrevMonth}>&lt;</NavArrow>
        <CurrentMonthYear>
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </CurrentMonthYear>
        <NavArrow onClick={handleNextMonth}>&gt;</NavArrow>
      </CalendarHeader>
      <DaysOfWeek>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </DaysOfWeek>
      <DayGrid>
        {days.map((day, index) => {
          const dateString = day ? formatDate(currentYear, currentMonth, day) : null;
          const isToday = dateString === todayDateString;
          const isSelected = dateString === selectedDate;
          const isInactive =
            day &&
            new Date(dateString) <
              new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <DayCell
              key={index}
              isToday={isToday}
              isSelected={isSelected}
              isInactive={isInactive}
              onClick={() => !isInactive && day && onSelectDate(dateString)}
            >
              {day}
            </DayCell>
          );
        })}
      </DayGrid>
    </CalendarContainer>
  );
};

// --- Review Components ---
const ReviewSection = styled.div`
  margin-top: 40px;
  background-color: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const StarRatingContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${(props) => (props.filled ? "#e50914" : "#555")};
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #e50914;
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewItem = styled.div`
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: #e0e0e0;
`;

const ReviewDate = styled.span`
  font-size: 14px;
  color: #888;
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
`;

const ReviewComment = styled.p`
  font-size: 16px;
  color: #ccc;
  line-height: 1.5;
`;

const StarRatingInput = ({ rating, setRating }) => {
  return (
    <StarRatingContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarButton
          key={star}
          filled={star <= rating}
          onClick={() => setRating(star)}
        >
          <FaStar />
        </StarButton>
      ))}
    </StarRatingContainer>
  );
};

const ReviewDisplay = ({ review, userName }) => {
  return (
    <ReviewItem>
      <ReviewHeader>
        <ReviewerName>{userName}</ReviewerName>
        <ReviewDate>{review.date}</ReviewDate>
      </ReviewHeader>
      <ReviewRating>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <FaStar key={i} color={i < review.rating ? "#e50914" : "#555"} />
          ))}
      </ReviewRating>
      <ReviewComment>{review.comment}</ReviewComment>
    </ReviewItem>
  );
};

// --- Registration Page ---
const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background-color: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ToggleButton = styled.button`
  background: none;
  color: #e50914;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
  &:hover {
    color: #c00c11;
  }
`;

const RegisterPage = () => {
  const { registerUser, signInUser, currentUser } = useContext(TurfContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    dob: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalRedirect, setModalRedirect] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateDOB = (dob) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dob)) return false;
    const [day, month, year] = dob.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year &&
      date < new Date()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!formData.name || !formData.email || !formData.contactNo || !formData.dob) {
        setModalMessage("Please fill all fields.");
        setIsModalOpen(true);
        return;
      }
      if (!validateDOB(formData.dob)) {
        setModalMessage("Please enter a valid DOB in DD/MM/YYYY format.");
        setIsModalOpen(true);
        return;
      }
      registerUser(formData);
      setModalMessage("Registration successful! You are now signed in.");
      setModalRedirect(true);
      setIsModalOpen(true);
    } else {
      if (!formData.email || !formData.contactNo) {
        setModalMessage("Please enter both Email-Id and Contact-No.");
        setIsModalOpen(true);
        return;
      }
      const success = signInUser(formData.email, formData.contactNo);
      if (success) {
        setModalMessage("Sign-in successful!");
        setModalRedirect(true);
        setIsModalOpen(true);
      } else {
        setModalMessage("Wrong Details");
        setIsModalOpen(true);
      }
    }
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setFormData({ name: "", email: "", contactNo: "", dob: "" });
  };

  return (
    <RegisterContainer>
      <SectionTitle title={isRegister ? "Register" : "Sign In"} />
      <RegisterForm onSubmit={handleSubmit}>
        {isRegister && (
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <Input
          type="email"
          name="email"
          placeholder="Email-Id"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="tel"
          name="contactNo"
          placeholder="Contact-No"
          value={formData.contactNo}
          onChange={handleChange}
        />
        {isRegister && (
          <Input
            type="text"
            name="dob"
            placeholder="DOB (DD/MM/YYYY)"
            value={formData.dob}
            onChange={handleChange}
          />
        )}
        <Button type="submit">{isRegister ? "Register" : "Sign In"}</Button>
        <ToggleButton type="button" onClick={toggleForm}>
          {isRegister ? "Already registered? Sign In" : "New user? Register"}
        </ToggleButton>
      </RegisterForm>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (modalRedirect) navigate("/");
        }}
      >
        <h2>{modalMessage.includes("successful") ? "Success" : "Error"}</h2>
        <p>{modalMessage}</p>
        <Button
          onClick={() => {
            setIsModalOpen(false);
            if (modalRedirect) navigate("/");
          }}
        >
          Close
        </Button>
      </Modal>
    </RegisterContainer>
  );
};

// --- 5. Pages ---
const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const TurfGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  justify-items: center;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const HomePage = () => {
  const { turfs, currentUser } = useContext(TurfContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/register");
    }
  }, [currentUser, navigate]);

  return (
    <ContentWrapper>
      <SectionTitle title="Available Turfs" />
      <TurfGrid>
        {turfs.map((turf) => (
          <TurfCard key={turf.id} turf={turf} />
        ))}
      </TurfGrid>
    </ContentWrapper>
  );
};

const TurfDetailContainer = styled.div`
  padding: 20px;
  color: #e0e0e0;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const TurfHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  background-color: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    padding: 20px;
  }
`;

const DetailImage = styled.img`
  width: 400px;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const DetailInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailTitle = styled.h1`
  font-size: 3em;
  font-weight: 700;
  color: #e0e0e0;
  @media (max-width: 768px) {
    font-size: 2.2em;
  }
  @media (max-width: 480px) {
    font-size: 1.8em;
  }
`;

const DetailMeta = styled.p`
  font-size: 1.2em;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 10px;
  svg {
    color: #e50914;
  }
  @media (max-width: 768px) {
    font-size: 1em;
    justify-content: center;
  }
`;

const DetailDescription = styled.p`
  font-size: 1.1em;
  line-height: 1.6;
  color: #aaa;
  margin-top: 10px;
  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const SlotSelectionSection = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 40px;
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const SlotColumn = styled.div`
  flex: 1;
  background-color: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
`;

const SlotColumnTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #e0e0e0;
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
`;

const TimeSlotButton = styled.button`
  padding: 12px 10px;
  border-radius: 8px;
  background-color: ${(props) => (props.isAvailable ? "#2a2a2a" : "#3a3a3a")};
  color: ${(props) => (props.isAvailable ? "#e0e0e0" : "#888")};
  cursor: ${(props) => (props.isAvailable ? "pointer" : "not-allowed")};
  border: ${(props) => (props.isSelected ? "2px solid #e50914" : "none")};
  font-weight: ${(props) => (props.isSelected ? "700" : "500")};
  transition: background-color 0.2s ease, border-color 0.2s ease;
  &:hover {
    background-color: ${(props) => (props.isAvailable ? "#3a3a3a" : "#3a3a3a")};
  }
`;

const BookingSummary = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const SummaryItem = styled.p`
  font-size: 18px;
  margin-bottom: 10px;
  color: #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span:first-child {
    font-weight: 500;
  }
  span:last-child {
    font-weight: 700;
    color: #e50914;
  }
`;

const TurfDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { turfs, bookings, reviews, addBooking, addReview, currentUser, users } = useContext(TurfContext);
  const [turf, setTurf] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/register");
    }
    const foundTurf = turfs.find((t) => t.id === id);
    if (foundTurf) {
      setTurf(foundTurf);
    } else {
      navigate("/");
    }
  }, [id, turfs, navigate, currentUser]);

  const getAvailableSlots = (date) => {
    if (!turf) return [];
    const bookedSlots = bookings
      .filter(
        (b) =>
          b.turfId === turf.id &&
          b.date === date &&
          (b.status === "confirmed" || b.status === "pending" || b.status === "blocked")
      )
      .map((b) => b.timeSlot);
    return turf.availableHours.filter((slot) => !bookedSlots.includes(slot));
  };

  const handleBookSlot = () => {
    if (turf && selectedDate && selectedTimeSlot && currentUser.role === "player") {
      addBooking({
        turfId: turf.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        userId: currentUser.id,
        status: "pending",
        paymentStatus: "unpaid",
      });
      setIsModalOpen(true);
    } else if (currentUser.role === "admin") {
      alert("Admins cannot book slots as players from this interface. Use the admin dashboard to block slots.");
    } else {
      alert("Please select a date and time slot.");
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewRating === 0 || !reviewComment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }
    addReview({
      turfId: turf.id,
      userId: currentUser.id,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewRating(0);
    setReviewComment("");
    setIsReviewModalOpen(true);
  };

  const getUserName = (userId) => users.find((u) => u.id === userId)?.name || "Unknown";

  const turfReviews = reviews.filter((r) => r.turfId === turf?.id);

  if (!turf) {
    return <TurfDetailContainer>Loading turf details...</TurfDetailContainer>;
  }

  const availableSlots = getAvailableSlots(selectedDate);
  const isBookButtonDisabled = !selectedTimeSlot || currentUser.role !== "player";

  return (
    <TurfDetailContainer>
      <TurfHeader>
        <DetailImage src={turf.imageUrl} alt={turf.name} />
        <DetailInfo>
          <DetailTitle>{turf.name}</DetailTitle>
          <DetailMeta>
            <FaMapMarkerAlt /> {turf.location}
          </DetailMeta>
          <DetailMeta>
            <FaRupeeSign /> {turf.pricePerHour} / hour
          </DetailMeta>
          <DetailDescription>{turf.description}</DetailDescription>
        </DetailInfo>
      </TurfHeader>

      <SlotSelectionSection>
        <SlotColumn>
          <SlotColumnTitle>Select Date</SlotColumnTitle>
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </SlotColumn>
        <SlotColumn>
          <SlotColumnTitle>Available Time Slots for {selectedDate}</SlotColumnTitle>
          {availableSlots.length > 0 ? (
            <TimeSlotGrid>
              {availableSlots.map((slot) => (
                <TimeSlotButton
                  key={slot}
                  isAvailable={true}
                  isSelected={selectedTimeSlot === slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                >
                  {slot}
                </TimeSlotButton>
              ))}
            </TimeSlotGrid>
          ) : (
            <p>No available slots for this date.</p>
          )}
          {selectedTimeSlot && (
            <BookingSummary>
              <SummaryItem>
                <span>Selected Slot:</span>
                <span>{selectedTimeSlot}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Price:</span>
                <span>
                  <FaRupeeSign /> {turf.pricePerHour}
                </span>
              </SummaryItem>
              <Button
                onClick={handleBookSlot}
                disabled={isBookButtonDisabled}
                style={{ width: "100%", marginTop: "20px" }}
              >
                Book Now
              </Button>
            </BookingSummary>
          )}
        </SlotColumn>
      </SlotSelectionSection>

      <ReviewSection>
        <SectionTitle title="Reviews" />
        <ReviewForm onSubmit={handleReviewSubmit}>
          <StarRatingInput rating={reviewRating} setRating={setReviewRating} />
          <StyledTextArea
            placeholder="Write your review..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
          <Button type="submit">Submit Review</Button>
        </ReviewForm>
        {turfReviews.length > 0 ? (
          <ReviewList>
            {turfReviews.map((review) => (
              <ReviewDisplay
                key={review.id}
                review={review}
                userName={getUserName(review.userId)}
              />
            ))}
          </ReviewList>
        ) : (
          <p>No reviews yet. Be the first to review this turf!</p>
        )}
      </ReviewSection>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Booking Request Sent!</h2>
        <p>
          Your booking for <strong>{turf.name}</strong> on <strong>{selectedDate}</strong> at{" "}
          <strong>{selectedTimeSlot}</strong> has been sent.
        </p>
        <p>It is currently <strong>pending</strong> and will be confirmed shortly.</p>
        <Button
          onClick={() => {
            setIsModalOpen(false);
            navigate("/my-bookings");
          }}
          style={{ marginTop: "20px" }}
        >
          View My Bookings
        </Button>
      </Modal>

      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
        <h2>Review Submitted!</h2>
        <p>Your review for <strong>{turf.name}</strong> has been submitted successfully.</p>
        <Button
          onClick={() => setIsReviewModalOpen(false)}
          style={{ marginTop: "20px" }}
        >
          Close
        </Button>
      </Modal>
    </TurfDetailContainer>
  );
};

const MyBookingsPageContainer = styled(ContentWrapper)``;

const NoBookingsMessage = styled.p`
  text-align: center;
  font-size: 1.2em;
  color: #888;
  margin-top: 50px;
`;

const MyBookingsPage = () => {
  const { bookings, turfs, currentUser } = useContext(TurfContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/register");
    }
  }, [currentUser, navigate]);

  const playerBookings = bookings.filter(
    (booking) => booking.userId === currentUser.id && booking.status !== "blocked"
  );

  return (
    <MyBookingsPageContainer>
      <SectionTitle title="My Bookings" />
      {playerBookings.length === 0 ? (
        <NoBookingsMessage>You have no bookings yet.</NoBookingsMessage>
      ) : (
        playerBookings.map((booking) => {
          const turf = turfs.find((t) => t.id === booking.turfId);
          return (
            <BookingCard
              key={booking.id}
              booking={booking}
              turfName={turf ? turf.name : "Unknown Turf"}
            />
          );
        })
      )}
    </MyBookingsPageContainer>
  );
};

const AdminDashboardContainer = styled(ContentWrapper)``;

const AdminSection = styled.div`
  background-color: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  margin-bottom: 40px;
`;

const AdminSectionHeader = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #e0e0e0;
  margin-bottom: 20px;
`;

const BookingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  th {
    background-color: #2a2a2a;
    color: #e50914;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
  }
  td {
    color: #ccc;
    font-size: 15px;
  }
  tr:last-child td {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  button {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }
  .approve {
    background-color: #28a745;
    &:hover {
      background-color: #218838;
    }
  }
  .reject {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
  .unblock {
    background-color: #6c757d;
    &:hover {
      background-color: #5a6268;
    }
  }
`;

const BlockSlotForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  color: #ccc;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  font-size: 16px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const AdminDashboardPage = () => {
  const { bookings, turfs, users, updateBookingStatus, blockSlot, unblockSlot, currentUser } = useContext(TurfContext);
  const navigate = useNavigate();
  const [blockFormData, setBlockFormData] = useState({
    turfId: turfs[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    timeSlot: turfs[0]?.availableHours[0] || "",
    notes: "",
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
    }
    if (turfs.length > 0 && !blockFormData.turfId) {
      setBlockFormData((prev) => ({
        ...prev,
        turfId: turfs[0].id,
        timeSlot: turfs[0].availableHours[0] || "",
      }));
    }
  }, [turfs, blockFormData.turfId, currentUser, navigate]);

  const handleBlockFormChange = (e) => {
    const { name, value } = e.target;
    setBlockFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlockSubmit = (e) => {
    e.preventDefault();
    if (blockFormData.turfId && blockFormData.date && blockFormData.timeSlot) {
      blockSlot(
        blockFormData.turfId,
        blockFormData.date,
        blockFormData.timeSlot,
        blockFormData.notes
      );
      alert("Slot blocked successfully!");
      setBlockFormData((prev) => ({ ...prev, notes: "" }));
    } else {
      alert("Please fill all fields to block a slot.");
    }
  };

  const getTurfName = (turfId) => turfs.find((t) => t.id === turfId)?.name || "N/A";
  const getUserName = (userId) => users.find((u) => u.id === userId)?.name || "N/A";

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const blockedSlots = bookings.filter((b) => b.status === "blocked");
  const playerUsers = users.filter((u) => u.role === "player");

  return (
    <AdminDashboardContainer>
      <SectionTitle title="Admin Dashboard" />
      <AdminSection>
        <AdminSectionHeader>Pending Booking Requests</AdminSectionHeader>
        {pendingBookings.length === 0 ? (
          <p>No pending booking requests.</p>
        ) : (
          <BookingTable>
            <thead>
              <tr>
                <th>Turf</th>
                <th>Date</th>
                <th>Time</th>
                <th>User</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{getTurfName(booking.turfId)}</td>
                  <td>{booking.date}</td>
                  <td>{booking.timeSlot}</td>
                  <td>{getUserName(booking.userId)}</td>
                  <td>
                    <StatusBadge status={booking.status}>{booking.status}</StatusBadge>
                  </td>
                  <td>
                    <StatusBadge status={booking.paymentStatus}>{booking.paymentStatus}</StatusBadge>
                  </td>
                  <td>
                    <ActionButtons>
                      <Button
                        className="approve"
                        onClick={() => updateBookingStatus(booking.id, "confirmed")}
                      >
                        Approve
                      </Button>
                      <Button
                        className="reject"
                        onClick={() => updateBookingStatus(booking.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </BookingTable>
        )}
      </AdminSection>
      <AdminSection>
        <AdminSectionHeader>Block Slots for Maintenance/Events</AdminSectionHeader>
        <BlockSlotForm onSubmit={handleBlockSubmit}>
          <FormRow>
            <FormLabel htmlFor="turfSelect">Turf:</FormLabel>
            <Select
              id="turfSelect"
              name="turfId"
              value={blockFormData.turfId}
              onChange={handleBlockFormChange}
            >
              {turfs.map((turf) => (
                <option key={turf.id} value={turf.id}>
                  {turf.name}
                </option>
              ))}
            </Select>
          </FormRow>
          <FormRow>
            <FormLabel htmlFor="dateInput">Date:</FormLabel>
            <Input
              type="date"
              id="dateInput"
              name="date"
              value={blockFormData.date}
              onChange={handleBlockFormChange}
            />
          </FormRow>
          <FormRow>
            <FormLabel htmlFor="timeSlotSelect">Time Slot:</FormLabel>
            <Select
              id="timeSlotSelect"
              name="timeSlot"
              value={blockFormData.timeSlot}
              onChange={handleBlockFormChange}
            >
              {turfs
                .find((t) => t.id === blockFormData.turfId)
                ?.availableHours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
            </Select>
          </FormRow>
          <FormRow>
            <FormLabel htmlFor="notesInput">Notes (Optional):</FormLabel>
            <Input
              type="text"
              id="notesInput"
              name="notes"
              placeholder="e.g., Annual maintenance"
              value={blockFormData.notes}
              onChange={handleBlockFormChange}
            />
          </FormRow>
          <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            <Button type="submit">Block Slot</Button>
          </div>
        </BlockSlotForm>
      </AdminSection>
      <AdminSection>
        <AdminSectionHeader>Blocked Slots</AdminSectionHeader>
        {blockedSlots.length === 0 ? (
          <p>No slots are currently blocked.</p>
        ) : (
          <BookingTable>
            <thead>
              <tr>
                <th>Turf</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockedSlots.map((booking) => (
                <tr key={booking.id}>
                  <td>{getTurfName(booking.turfId)}</td>
                  <td>{booking.date}</td>
                  <td>{booking.timeSlot}</td>
                  <td>{booking.notes || "Maintenance"}</td>
                  <td>
                    <ActionButtons>
                      <Button
                        className="unblock"
                        onClick={() =>
                          unblockSlot(booking.turfId, booking.date, booking.timeSlot)
                        }
                      >
                        Unblock
                      </Button>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </BookingTable>
        )}
      </AdminSection>
      <AdminSection>
        <AdminSectionHeader>Registered Users</AdminSectionHeader>
        {playerUsers.length === 0 ? (
          <p>No registered users.</p>
        ) : (
          <BookingTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>DOB</th>
              </tr>
            </thead>
            <tbody>
              {playerUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contactNo}</td>
                  <td>{user.dob}</td>
                </tr>
              ))}
            </tbody>
          </BookingTable>
        )}
      </AdminSection>
    </AdminDashboardContainer>
  );
};

// --- 6. Main App Component ---
const AppContainer = styled.div`
  background-color: #121212;
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Router>
      <GlobalStyles />
      <TurfProvider>
        <AppContainer>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/turf/:id" element={<TurfDetailPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="*"
              element={
                <ContentWrapper>
                  <h1>404: Page Not Found</h1>
                </ContentWrapper>
              }
            />
          </Routes>
          <Footer />
        </AppContainer>
      </TurfProvider>
    </Router>
  );
}

export default App;
