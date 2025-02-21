import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';

const Home = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  // Problem 1: Fetching data from a fake API, but response handling is broken

  const callApi = async () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => {
        // Error: the data isn't being handled correctly
        setData(json);
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  useEffect(() => {
    callApi();
  }, []);

  // Problem 2: The button to increase the count doesn't work
  const incrementCount = () => {
    setCount(count + 1);
  };

  // Problem 3: Conditional rendering doesn't work when count > 5
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welc!</Text>
      <Text>Count: {count}</Text>

      {/* The button doesn't change the count due to a bug */}
      <Button title="Increment Count" onPress={incrementCount} />

      <FlatList
        data={data}
        renderItem={({item}) => <Text>{item.title}</Text>}
        keyExtractor={item => item.id.toString()}
      />

      <Button title="hit" onPress={callApi} />

      {/* Problem 3: The count being greater than 5 doesn't trigger this */}
      {count > 5 && <Text style={styles.alert}>Count is more than 5!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  alert: {
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
});

export default Home;
