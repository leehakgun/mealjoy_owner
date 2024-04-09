import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from '@expo/vector-icons';

const App = ({ route }) => {
  const [successNotice, setSuccessNotice] = useState(0);

  
  const incrementCount = (table_num) => {
    setTableList((current) =>
      current.map((table) =>
        table.table_num === table_num
          ? {
              ...table,
              incrementCount: table.incrementCount + 1 <= table.label_count ? table.incrementCount + 1 : table.incrementCount,
            }
          : table
      )
    );
  };
  
  
  const decrementCount = (table_num) => {
    setTableList((current) =>
      current.map((table) =>
        table.table_num === table_num
          ? { ...table, incrementCount: Math.max(0, table.incrementCount - 1) }
          : table
      )
    );
  };

  // 테이블 인원 수를 업데이트하는 함수
  const activateTableCount = async (tableSeq,storeSeq,tableNum,tableSu,state) => {
    const currentTable = tableList.find(table => table.table_seq === tableSeq);
  
    console.log("Asdfas",tableSu,storeSeq,tableNum,currentTable.count,tablesu,state);
    let tablesu; // Variable to store the final table object
    setTableList((current) => {
      tablesu = current.map((table) =>
        table.table_num === tableNum
          ? { 
              ...table, 
              state_count: Math.max(0, Math.min(table.state_count, table.state_count - table.incrementCount)), // Ensure count doesn't go below 0 or exceed current count
              incrementCount: 0 
            }
          : table
      );
      return tablesu; // Return the updated table list
    });
    try {
      // userInfo에서 userId 추출

      // 서버에 요청 보내기
      const response = await axios.post(
        "http://61.80.80.153:8090/botbuddies/plustable",
        {
          state:state,
          tablesu: (tableSu),
          store_seq: storeSeq,
          table_num: tableNum,
        }
      );

      setTableList((current) =>
      current.map((table) =>
        table.table_num === tableNum ? { ...table, incrementCount: 0 } : table
      )
    );
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
    
    // Now, the variable 'tablesu' contains the final modified table object
  };

  const beactivateTableCount = async (tableSeq,storeSeq,tableNum,tableSu,sumtable,stateTable) => {
    const currentTable = tableList.find(table => table.table_seq === tableSeq);
    console.log("Asdfas",tableSu,storeSeq,tableNum,currentTable.count,tablesu);
    let tablesu; // Variable to store the final table object
    setTableList((current) => {
      tablesu = current.map((table) =>
        table.table_num === tableNum
          ? { 
              ...table, 
              state_count: Math.min(table.state_count + table.incrementCount, sumtable), // Limit count to 4
              incrementCount: 0 // Adjust incrementCount if count exceeds 4
            }
          : table
      );
      return tablesu; // Return the updated table list
    });
    

    try {
      // userInfo에서 userId 추출

      // 서버에 요청 보내기
      const response = await axios.post(
        "http://61.80.80.153:8090/botbuddies/minustable",
        {
          tablesu: (currentTable.state_count+tableSu),
          store_seq: storeSeq,
          table_num: tableNum,
        }
      );
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
    // Now, the variable 'tablesu' contains the final modified table object
  };


  const navigation = useNavigation();

  const data = route?.params?.reviewData ?? { tableList: [] };
  const storeInfo = data.store;
  const reservaListData = data.reservaList;
  const orderList = data.orederList;
  const tablingList = data.tablingList;
  const [reservaList, setReservaList ]= useState(reservaListData);
  console.log("reservaTest",reservaList)
  
  const [tableList, setTableList] = useState(
    data.tableList.map((table) => ({ ...table, count: 0, incrementCount: 0 }))
  );
 
  const total = data.total_pay;

  console.log(total);

  const [selectedReservations, setSelectedReservations] = useState([]);

  const [selectedTab, setSelectedTab] = useState("reservation");
  const [selectedStand, setSelectedStand] = useState(null);
  const [selectedStands, setSelectedStands] = useState([]);
  const orders = useMemo(
    () => [
      { item: "타코", quantity: 2 },
      { item: "부리토", quantity: 1 },
      { item: "부리토", quantity: 1 },
    ],
    []
  );


  useEffect(() => {
    const restoreNotifiedStatus = async () => {
        const updatedStatus = {...standStatus};
        const promises = tablingList.map(async (stand) => {
            const notified = await AsyncStorage.getItem(`notified_${stand.wait_num}`);
            if (notified) {
                updatedStatus[stand.wait_num] = 'notified';
            }
        });

        await Promise.all(promises);
        setStandStatus(updatedStatus);
    };

    restoreNotifiedStatus();
}, []);
  const [confirmedReservations, setConfirmedReservations] = useState([]);

  // 컴포넌트가 마운트될 때 실행되는 useEffect
  useEffect(() => {
    const loadStoredReservations = async () => {
      try {
        const storedReservationsString = await AsyncStorage.getItem(
          "selectedReservations"
        );
        const storedReservations = storedReservationsString
          ? JSON.parse(storedReservationsString)
          : [];
        setSelectedReservations(storedReservations);
      } catch (error) {
        console.error(
          "Failed to load the reservations from AsyncStorage",
          error
        );
      }
    };

    loadStoredReservations();
  }, []);


 


  const reservations = useMemo(
    () => [
      { id: "r1", time: "17:30", name: "정상권", people: 3 },
      { id: "r2", time: "18:20", name: "박지뉴", people: 3 },
    ],
    []
  );
  const stands = useMemo(
    () => [{ name: "정상권", people: 2, waitingTime: "15분" }],
    []
  );

  const Okreserve = async (id,user_id) => {
    console.log("몇번", id);
    console.log("아이디",user_id)
    const updateAndStoreSelectedReservations = async (
      newSelectedReservations
    ) => {
      setSelectedReservations(newSelectedReservations);
      await AsyncStorage.setItem(
        "selectedReservations",
        JSON.stringify(newSelectedReservations)
      );
    };
    try {
      // userInfo에서 userId 추출

      // 서버에 요청 보내기
      const response = await axios.post(
        "http://61.80.80.153:8090/botbuddies/reserveState",
        {
          reserve_seq: id,
          store_seq:storeInfo.store_seq,
          user_id: user_id
        }

        );
        setReservaList(response.data);
        renderReservationContent();
      await fetchReservations();
    
    // 화면을 '재시작'하는 로직
    // 현재 화면을 'YourScreenName'으로 대체 (재시작 효과)
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
  };

  const Cancelreserve = async (id,user_id) => {
    console.log("몇번", id);
    console.log("아이디",user_id);
    try {
      // userInfo에서 userId 추출

      // 서버에 요청 보내기
      const response = await axios.post(
        "http://61.80.80.153:8090/botbuddies/reserveStatecancel",
        {
          reserve_seq: id,
          store_seq:storeInfo.store_seq,
          user_id: user_id
        }
      );
      setReservaList(response.data)
      renderReservationContent();
      await fetchReservations();
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  // 천원단위 표시
  const formatMoney = (돈) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(돈);
  };

  const sales = 2210340;

  const salesText = useMemo(
    () => [
      { money: formatMoney(sales) }, // "2,210,340"
    ],
    [sales]
  );

  const formatTime = (timeString) => {
    const time = new Date(`2021-01-01T${timeString}`); // 임의의 날짜와 결합하여 Date 객체 생성
    return time.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const go_mypage = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
      const response = await axios.post(`http://61.80.80.153:8090/botbuddies/review`, {
        userId: userInfo.user_id
      });
  
      // 서버로부터 받은 데이터를 review_managent 화면으로 전달
      navigation.navigate('mypage_managent', { reviewData: response.data });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  const go_home = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
      const response = await axios.post(`http://61.80.80.153:8090/botbuddies/review`, {
        userId: userInfo.user_id
      });
  
      // 서버로부터 받은 데이터를 review_managent 화면으로 전달
      navigation.navigate('admin_main', { reviewData: response.data });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }


  const fetchReservations = async () => {
    try {
      const response = await axios.get("서버의 예약 목록 조회 URL");
      if (response.status === 200) {
        // 예약 목록 상태 업데이트
        setReservaList(response.data.reservations);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };


  const confirmReservation = (state, id,user_id) => {
    if (state == "1") {
      Alert.alert("예약 취소", "선택한 예약을 취소하시겠습니까?", [
        {
          text: "아니오",
          onPress: () => console.log("예약 취소 취소"),
          style: "cancel",
        },
        {
          text: "예",
          onPress: async () => {
            // 예약 취소 로직 실행
            await Cancelreserve(id,user_id);
            // 예약 목록에서 해당 예약 ID를 제외
            const updatedReservations = selectedReservations.filter(
              (reservationId) => reservationId !== id
            );
            setSelectedReservations(updatedReservations);
            // 예약 목록 상태를 업데이트하는 추가 로직이 필요한 경우 여기에 추가
            console.log("예약 취소 완료");
            // 예약 목록 갱신을 위한 함수 호출 등
          },
        },
      ]);
    } else {
      Alert.alert("예약 확인", "예약을 확정하시겠습니까?", [
        {
          text: "아니오",
          onPress: () => console.log("예약 확정 취소"),
          style: "cancel",
        },
        {
          text: "예",
          onPress: async () => {
            // 예약 확정 로직 실행
            await Okreserve(id,user_id);
            // 예약 목록에 해당 예약 ID를 추가
            setSelectedReservations([...selectedReservations, id]);
            await fetchReservations();
            console.log("예약 확정");
            // 예약 목록 갱신을 위한 함수 호출 등
          },
        },
      ]);
    }
  };


  
  const getListStyle = () => {
    switch (selectedTab) {
      case "reservation":
        return listStyle === "confirmed" ? styles.listConfirmed : styles.list;
      case "stand":
        return listStyle === "confirmed"
          ? styles.listConfirmedStand
          : styles.listStand;
      default:
        return styles.list;
    }
  };

  const TableStatus = ({ number, status, onToggle }) => (
    <View style={styles.tableContainer}>
      <Text style={styles.tableNumber}>{`${number}인석`}</Text>
      <TouchableOpacity
        style={[styles.statusButton, status === "occupied" && styles.occupied]}
        onPress={onToggle}
      >
        <Text
          style={[
            styles.statusText,
            status === "occupied" && styles.occupiedText,
          ]}
        >
          {status === "occupied" ? "자리없음" : "자리있음"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const [tables, setTables] = useState([
    { id: 1, status: "available" },
    { id: 2, status: "available" },
    { id: 4, status: "available" },
    { id: 6, status: "available" },
    { id: 8, status: "available" },
  ]);

  const toggleTableStatus = (tableId) => {
    const tableIndex = tables.findIndex((t) => t.id === tableId);
    if (tableIndex > -1) {
      const newStatus =
        tables[tableIndex].status === "available" ? "occupied" : "available";
      Alert.alert(
        "자리 상태 변경",
        `${
          newStatus === "available" ? "자리있음으로" : "자리없음으로"
        } 변경하시겠습니까?`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "확인",
            onPress: () => {
              const updatedTables = [...tables];
              updatedTables[tableIndex] = {
                ...updatedTables[tableIndex],
                status: newStatus,
              };
              setTables(updatedTables);
            },
          },
        ]
      );
    }
  };

  const confirmAndHandleOrderPress = (order) => {
    Alert.alert(
      "주문 확인", // 제목
      "주문이 완료되었습니까?", // 메시지
      [
        {
          text: "취소", // 취소 버튼
          onPress: () => console.log("주문 확인 취소"), // 취소 버튼 클릭 시 실행될 함수
          style: "cancel",
        },
        {
          text: "확인", // 확인 버튼
          onPress: () => handleOrderPress(order), // 확인 버튼 클릭 시 실행될 함수
        },
      ]
    );
  };

  const handleOrderPress = async (order) => {
    console.log("몇번", order.order_num);
    try {
      // 서버에 요청 보내기
      const response = await axios.post(
        "http://61.80.80.153:8090/botbuddies/ordercheck",
        {
          order_num: order.order_num,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  }, []);

  const renderOrderContent = () => {
    return orderList.map((order) => (
      <TouchableOpacity
        key={order.order_num}
        onPress={() => confirmAndHandleOrderPress(order)}
      >
        <View style={[styles.contentContainer, styles.orderBox]}>
          <Text style={[styles.currentTime, { alignSelf: "flex-end" }]}>
            {order.user_name}
          </Text>
          <View style={{ alignSelf: "stretch" }}>
            <Text style={styles.orderTitle}>주문 내역:</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                marginBottom: 10,
              }}
            >
              <Text style={[styles.itemText, { marginRight: 10 }]}>
                {order.menu_names}
              </Text>
            </View>
          </View>
          <Text style={{ alignSelf: "flex-end" }}>{order.time}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const renderReservationContent = () => {
    return reservaList.map((reservation) => (
      <TouchableOpacity
        key={reservation.reserve_seq}
        onPress={() =>
          confirmReservation(reservation.state, reservation.reserve_seq,reservation.user_id)
        }
        style={[
          styles.reservationContainer,
          reservation.state == "1" ? styles.selectedReservation : {},
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.reservationText, styles.reservationTime]}>
            {reservation.reserve_date} {formatTime(reservation.reserve_time)}
          </Text>
          <Text style={[styles.reservationText, styles.reservationName]}>
            {reservation.reserve_name}
          </Text>
        </View>
        <Text style={styles.reservationPeople}>
          인원: {reservation.reserve_num}명
        </Text>
      </TouchableOpacity>
    ));
  };

  

  const renderStandContent = () => {
    return tablingList.map((stand, index) => {
      // stand.state가 0일 때만 항목을 렌더링
      if (stand.state == 3) {
        return null;
      } else if (stand.state == 0) {
        const isNotified = standStatus[stand.wait_num] === 'notified'; // 알림이 보내진 상태인지 확인
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.itemContainer,
              styles.reservationStandBox,
              selectedStands.includes(stand.wait_num)
                ? styles.selectedStand
                : styles.unselectedStand,
            ]}
            onPress={() =>
              !selectedStands.includes(stand.wait_num) &&
              confirmStandSelection(stand.wait_num, stand.user_id, stand.state,stand.tabling_seq)
            }
            disabled={selectedStands.includes(stand.wait_num)} // 선택된 항목은 클릭 비활성화
          >
            <Text style={isNotified ? styles.notifiedText : styles.itemText}>
              대기 번호: {stand.wait_num} 인원: {stand.people_num}명
            </Text>
          </TouchableOpacity>
        );
      } else if (stand.state == 1) {
        return null;
      } else if (stand.state == 2) {
        return null;
      }
    });
  };
  
  const [standStatus, setStandStatus] = useState({});

  const confirmStandSelection = (wait_num, user_id, state,tabling_seq) => {
    const currentStatus = standStatus[wait_num];
    
    if (!currentStatus) {
      // 알림 전송 전
      Alert.alert(
        "알림 보내기",
        `대기 ${wait_num}번 팀에게 알림을 보내시겠습니까?`,
        [
          {
            text: "알림보내기",
            onPress: () => {
              comeon(wait_num, user_id,tabling_seq); // 알림 전송 함수 호출
              setStandStatus(prev => ({ ...prev, [wait_num]: 'notified' })); // 상태 업데이트
            },
          },
          { text: "닫기", onPress: () => console.log("알림 창 닫기"), style: "cancel" },
        ],
        { cancelable: true }
      );
    } else if (currentStatus === 'notified') {
      // 알림 전송 후
      Alert.alert(
        "대기 번호 처리",
        `대기 ${wait_num}번 팀을 어떻게 처리하시겠습니까?`,
        [
          {
            text: "완료",
            onPress: () => {
              setStandStatus(prev => ({ ...prev, [wait_num]: 'completed' })); // 상태를 'completed'로 업데이트
              completeStand(wait_num,user_id)
            },
          },
          {
            text: "노쇼",
            onPress: () => {
              noshow(wait_num, user_id);
              console.log(`${wait_num}에 대한 노쇼 처리`);
              // 노쇼 처리 후에도 selectedStands 배열에 wait_num을 추가
              setSelectedStands((prev) => [...prev, wait_num]);
            },
          },
          { text: "닫기", onPress: () => console.log("처리 창 닫기"), style: "cancel" },
        ],
        { cancelable: true }
      );
    }
    // 'completed' 및 'no-show' 상태에 대한 추가 로직 구현이 필요할 수 있음
  };


const completeStand = async (wait_num,user_id) => {
  console.log("대기 완료", wait_num);
  try {
    // 서버에 요청 보내기
    const response = await axios.post(
      "http://61.80.80.153:8090/botbuddies/completeStand",
      {
        wait_num: wait_num,
        user_id,user_id
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching stores:", error);
  }

};


  const noshow = async (wait_num,user_id) => {
    console.log("몇번", wait_num);
    try {
      // 서버에 요청 보내기
      const response = await axios.post(
        "http://61.80.80.153:8090/botbuddies/noshow",
        {
          wait_num: wait_num,
          user_id,user_id
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  const comeon = async (wait_num, user_id, tabling_seq) => {
    console.log("알림보내기", user_id, tabling_seq);
    try {
        const response = await axios.post("http://61.80.80.153:8090/botbuddies/comeon", {
            wait_num: wait_num,
            user_id: user_id,
        });
        console.log("응답데이터", response.data);

        if (response.data === 1) {
            setSuccessNotice(1);
            await AsyncStorage.setItem(`notified_${wait_num}`, 'true');
            setStandStatus(prev => ({ ...prev, [wait_num]: 'notified' }));
        }
    } catch (error) {
        console.error("Error fetching stores:", error);
        setSuccessNotice(0);
    }
};
  const activeStands = tablingList.filter((item) => item.state == 0).length;
  const renderContent = () => {
    switch (selectedTab) {
      case "reservation":
        return reservaList.length > 0 ? (
          renderReservationContent()
        ) : (
          <Text style={styles.noDataText}>예약이 없습니다.</Text>
        );
      case "order":
        return orderList.length > 0 ? (
          renderOrderContent()
        ) : (
          <Text style={styles.noDataText}>주문이 없습니다.</Text>
        );
      case "stand":
        
        console.log("대기 목록",activeStands);
        return activeStands > 0 ? (
          renderStandContent()
        ) : (
          <Text style={styles.noDataText}>대기 목록이 없습니다.</Text>
        );
      default:
        return null;
    }
  };
console.log("대기",tablingList);

  const renderReservationItem = ({ id, time, name, people }) => {
    return (
      <TouchableOpacity
        key={id}
        onPress={() => confirmReservation(id)}
        style={styles.reservationItem}
      >
        <Text
          style={styles.reservationText}
        >{`${time} - ${name}님, 인원: ${people}명`}</Text>
      </TouchableOpacity>
    );
  };

  const renderReservations = () => {
    return reservations.map(renderReservationItem);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("admin_main")}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#ff3b30" />
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: storeInfo.img_filename }}
          />
        </View>

        <Text style={styles.title}>{storeInfo.store_name}</Text>
        <Text style={styles.subtitle}>{storeInfo.store_desc}</Text>

        <View style={styles.contentContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "reservation" && styles.activeTab,
              ]}
              onPress={() => setSelectedTab("reservation")}
            >
              <Text>예약</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "order" && styles.activeTab]}
              onPress={() => setSelectedTab("order")}
            >
              <Text>주문</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "stand" && styles.activeTab]}
              onPress={() => setSelectedTab("stand")}
            >
              <Text>대기</Text>
            </TouchableOpacity>
          </View>
          {renderContent()}
          <View>
            <Text style={styles.tableList}>테이블 현황</Text>
          </View>
            <View style={styles.headerDivider} />

            {tableList.length > 0 ? (
    tableList.map((table, index) => (
      <View key={index} style={styles.tableContainer}>
        <Text style={styles.tableText}>{`${table.table_num}인석`}</Text>
        <Text style={styles.seatText}>{`${table.state_count}/${table.label_count}`}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => decrementCount(table.table_num)}
            style={[styles.stepperButton, styles.stepperButtonLeft]}
          >
            <Text style={styles.stepperButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.countText}>{table.incrementCount}</Text>
          <TouchableOpacity
            onPress={() => incrementCount(table.table_num)}
            style={[styles.stepperButton, styles.stepperButtonRight]}
          >
            <Text style={styles.stepperButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (table.state_count > 0) {
                activateTableCount(table.table_seq, table.store_seq, table.table_num, table.incrementCount, table.state_count);
              }
            }}
            disabled={table.state_count === 0}
            style={[styles.button, styles.activateButton, table.state_count === 0 && styles.disabledButton]}
          >
            <Text style={[styles.buttonText1, !(table.state_count === 0) && styles.activeText]}>{'자리비움'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => beactivateTableCount(table.table_seq, table.store_seq, table.table_num, table.incrementCount, table.label_count, table.state_count)}
            style={[styles.button, styles.deactivateButton]}
          >
            <Text style={styles.buttonText}>자리채움</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))
  ) : (
    // 테이블 리스트가 비어 있는 경우 표시될 메시지
    <Text style={styles.Notabletext}>등록된 테이블이 없습니다.</Text>
  )}
              
          
            <View style={styles.headerDividertwo} />
          <View>
            <Text style={styles.sales}>총매출</Text>
            <Text style={styles.money}>{formatMoney(total)}원</Text>
          </View>
        </View>
      </ScrollView>
      <SafeAreaView>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={(go_home)}>
          <Entypo name="home" size={24} color="#ff3b30" />
        </TouchableOpacity> 
       
        <TouchableOpacity style={styles.tabItem} onPress={(go_mypage)}>
          <FontAwesome name="user" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    position: "absolute", // ensure image also uses absolute positioning
    top: 0,
    left: 0,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  tableList: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 10,
    alignContent: "center",
    padding: 10,
  },
  tableContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // 이 부분을 추가하세요
    alignItems: "center",
    marginBottom: 10,
  },
  tableText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 25,
    marginRight: 5,
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ff3b30",
    width: 80,
    height: 40,
    marginBottom: 10,
    marginRight: 20,
  },
  occupied: {
    backgroundColor: "#ff3b30",
  },
  statusText: {
    color: "black",
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    marginTop: 5,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#dcdcdc",
    paddingVertical: 10,
  },
  menuItem: {
    alignItems: "center",
  },
  orderContainer: {
    padding: 20,
  },
  currentTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  orderItem: {
    fontSize: 16,
    marginTop: 5,
  },
  reservationContainer: {
    borderColor: "#ff3b30",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: "80%",
    alignSelf: "center",
    padding: 10, // 내부 패딩 조정
    marginBottom: 5, // 요소 간 간격
  },
  standContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  standText: {
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginBottom: 10, // 수정된 부분
    textAlign: "center", // 추가된 부분
    padding: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "grey",
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: "center", // 추가된 부분
  },
  contentContainer: {
    marginVertical: 10,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  contentSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  itemContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    borderColor: "#ff3b30",
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    textAlign: "center",
  },
  reservationText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedReservation: {
    backgroundColor: "#dedede",
    borderColor: "#f0f0f0",
  },
  orderBox: {
    borderColor: "#ff3b30", // 빨간색 테두리
    borderWidth: 1, // 테두리 두께
    borderRadius: 10, // 모서리 둥글기
    padding: 10, // 내부 여백
    margin: 10, // 외부 여백
    width: "85%", // 박스의 너비를 부모 컨테이너의 95%로 설정
    alignSelf: "center", // 부모 컨테이너 중앙 정렬
  },
  sales: {
    fontSize: 25,
    padding: 5,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 30,
  },
  money: {
    fontSize: 40,
    textAlign: "right",
    padding: 5,
    marginRight: 30,
  },
  reservationStandBox: {
    borderColor: "#ff3b30",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: "80%",
    alignSelf: "center",
  },
  reservationTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reservationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reservationPeople: {
    fontSize: 16,
    textAlign: "right",
  },
  unselectedStand: {
    backgroundColor: "white",
  },
  selectedStand: {
    backgroundColor: "#dedede", // 연한 회색
    borderColor: "#f0f0f0",
  },
  backIcon: {
    position: "absolute", // Position the icon absolutely
    top: 10, // 10 pixels from the top
    left: 10, // 10 pixels from the left
    padding: 10, // Optional: if you want to increase the clickable area
  },
  backButton: {
    position: "absolute", // This positions the button absolutely within imageContainer
    top: 40, // Distance from the top of the imageContainer
    left: 20, // Distance from the left of the imageContainer
    backgroundColor: "white", // White circular background
    borderRadius: 20, // Makes it round
    padding: 6, // Padding inside the circle to make it larger or smaller
    elevation: 3, // Adds a slight shadow on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 1, // Shadow blur radius for iOS
    zIndex: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  activateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  buttonText1: {
    color: "black",
  },
  activeText: {
    color: "#FF3B30", // 활성화 상태의 글자 색상은 빨간색
  },
  deactivateButton: {
    backgroundColor: "#F44336", // Red
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  stepperButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },
  stepperButtonLeft: {
    marginRight: 10,
  },
  stepperButtonRight: {
    marginLeft: 10,
  },
  stepperButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "grey",
    textAlign: "center",
    marginTop: 10,
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  Notabletext:{
    fontSize: 16,
    fontWeight: "bold",
    color: "grey",
    textAlign: "center",
    
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#cccccc", // 비활성화된 버튼의 배경색
    borderColor: "#aaaaaa", // 비활성화된 버튼의 테두리 색
  },
  notifiedText: {
    color: '#ff3b30', // 빨간색으로 설정
    textAlign:'center',
    fontSize:16,
  },
  buttonText2:{
    color:"#ff3b30"
  },
  headerDivider: {
    height: 1, // 구분선의 두께
    backgroundColor: "#e0e0e0", // 구분선 색상
    marginVertical: 10, // 위 아래 마진
  },
  headerDividertwo:{
    height: 1, // 구분선의 두께
    backgroundColor: "#e0e0e0", // 구분선 색상
    marginVertical: 3, // 위 아래 마진
  },
  tabBar: {
    height: 60,
    flexDirection: 'row',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
});

export default App;