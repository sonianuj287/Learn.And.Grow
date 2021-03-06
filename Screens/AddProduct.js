import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Alert, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, TextInput, View } from "react-native";
import Button from "react-native-button";
import { AppStyles } from "../assets/AppStyles";
import { ScrollView } from 'react-native-gesture-handler';
import { addProduct } from '../API/firebaseMethods';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';


export default class AddProduct extends React.Component {


    state = {
        imagePath: require("./default.png"),
        imageName: '',
        name: '',
        description: '',
        price: '',

    }
    constructor(props)
    {
        super(props);
    }
    
    handlePress = () => {

        if (!this.state.name) {
          Alert.alert('Name is required');
        } else if (!this.state.description) {
          Alert.alert('Description is required.');
        } else if (!this.state.price) {
          Alert.alert('Price is required.');
        }
        else
        {
            
            addProduct(

                this.state.name,
                this.state.description,
                this.state.price,
                this.state.imageName,
                this.state.imagePath
    
            );
           // this.uploadImageToStorage(this.state.imagePath, this.state.imageName, this.state.name);
            
            this.props.navigation.replace('AddProduct')


        }
    };

    chooseFile = () => {
        this.setState({ status: '' });
        var options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true, // do not backup to iCloud
                path: 'images', // store camera images under Pictures/images for android and Documents/images for iOS
            },
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker', storage());
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let path = this.getPlatformPath(response).value;
                let fileName = this.getFileName(response.fileName, path);
                this.setState({ imagePath: path });
                this.setState({imageName: fileName});
            }
        });
    };

    getFileName(name, path) 
    {
        if (name != null) { return name; }

        if (Platform.OS === "ios") {
            path = "~" + path.substring(path.indexOf("/Documents"));
        }
        return path.split("/").pop();
    }

    uploadImageToStorage(path, name, uid) {
        this.setState({ isLoading: true });
        let reference = storage().ref(`Products/${this.state.name}`);
        let task = reference.putFile(path);
        
        task.then(() => {
            console.log('Image uploaded to the bucket!');
            this.setState({ isLoading: false, status: 'Image uploaded successfully' });
        }).catch((e) => {
            status = 'Something went wrong';
            console.log('uploading image error => ', e);
            this.setState({ isLoading: false, status: 'Something went wrong' });
        });
    }


    getPlatformPath({ path, uri }) {
        return Platform.select({
            android: { "value": path },
            ios: { "value": uri }
        })
    }

    getPlatformURI(imagePath) {
        let imgSource = imagePath;
        if (isNaN(imagePath)) {
            imgSource = { uri: this.state.imagePath };
            if (Platform.OS == 'android') {
                imgSource.uri = "file:///" + imgSource.uri;
            }
        }
        return imgSource
    }


    render() {

        let { imagePath } = this.state;
        let imgSource = this.getPlatformURI(imagePath)

        return (
            <SafeAreaView >
                <ScrollView>
                    <View style={styles.container} >
                        <View style={styles.InputContainer}>
                            <TextInput
                                style={styles.body}
                                placeholder="Product Name"
                                onChangeText={(text) => { this.setState({ name: text }) }}

                                value={this.state.name}
                                placeholderTextColor={AppStyles.color.grey}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.InputContainer}>
                            <TextInput
                                style={styles.body}
                                placeholder="Product Description"
                                onChangeText={(text) => { this.setState({ description: text }) }}
                                value={this.state.description}
                                placeholderTextColor={AppStyles.color.grey}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.InputContainer}>
                            <TextInput
                                style={styles.body}
                                placeholder="Price"
                                onChangeText={(text) => { this.setState({ price: text }) }}
                                value={this.state.price}
                                placeholderTextColor={AppStyles.color.grey}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={{ height: '3%' }}></View>

                        <Image style={styles.uploadImage} source={imgSource} />
                        <View style={{ height: '2%' }}></View>
                        <TouchableOpacity onPress={() => this.chooseFile()} style={{height:20, borderRadius:5, width:100, backgroundColor:"black"}}>
                        
                        
                        <Text style={{color:"white", paddingLeft:3}}>Choose Picture</Text>
                        </TouchableOpacity>
                        
                        
    
                    
                        <TouchableOpacity onPress={() => this.handlePress()} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>Add Product</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </SafeAreaView>

        );

    }


}

const styles = StyleSheet.create({

    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: "bold",
        color: AppStyles.color.tint,
        marginTop: 20,
        marginBottom: 20
    },
    leftTitle: {
        alignSelf: "stretch",
        textAlign: "left",
        marginLeft: 20
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: "center",
        fontSize: AppStyles.fontSize.content,
        color: AppStyles.color.text
    },
    loginContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.tint,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30
    },
    loginText: {
        color: AppStyles.color.white
    },
    placeholder: {
        fontFamily: AppStyles.fontName.text,
        color: "red"
    },
    InputContainer: {
        width: AppStyles.textInputWidth.main,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: AppStyles.color.grey,
        borderRadius: AppStyles.borderRadius.main
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.color.text
    },
    facebookContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.tint,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30
    },
    facebookText: {
        color: AppStyles.color.white
    },

    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    container: {
        flex: 3,
        width: '100%',
        height: '80%',
        backgroundColor: '#e6e6fa',
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    eightyWidthStyle: {
        width: '80%',
        margin: 2,
    },
    uploadImage: {
        width: '30%',
        height: 100,
    },
    loadingIndicator: {
        zIndex: 5,
        width: '100%',
        height: '100%',
    },
    boldTextStyle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#5EB0E5',
    }


});
