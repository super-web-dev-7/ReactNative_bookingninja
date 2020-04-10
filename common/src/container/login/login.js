import React, {Component} from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import {Text, View} from 'react-native-animatable';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {TextField} from 'react-native-material-textfield';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {disposeOnUnmount, inject, observer} from "mobx-react";
import {reaction} from "mobx";
import {showLongToast} from "../../utils/toast-utils";
import {saveString} from "../../lib/storage";
import {AUTH_KEYS} from "../../utils/keys";
import {ENV} from "../../env_vars";

const ANIM_TIMINGS = {
    delay_1: 300,
    delay_2: 500,
    delay_3: 700,
    delay_4: 800,
    delay_login_1: 200,
    delay_login_2: 400,
    delay_login_3: 300,
    delay_login_4: 1200,
}

@inject("userStore")
@observer
export default class Login extends Component {

    state = {
        animationLogo: 'zoomIn',
        animationTitle: 'zoomIn',
        animationButton: 'bounceInUp',
    }

    @disposeOnUnmount
    loginErrorDisposer

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            errorPassword: '',
            confirm: '',
            errorConfirm: '',
            email: '',
            errorEmail: '',
            secureTextEntry: true,
            isLoginForm: 'form',
            animationLogo_Form: 'zoomIn',
            animationButton_Form: 'bounceInUp',
            animationLogo_Login: 'zoomIn',
            animationButton_Login: 'bounceInUp',
            selectedOrg: 'production'
        }
        this.onAccessoryPress = this.onAccessoryPress.bind(this);
        this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);
    }

    componentDidMount() {
        this.loginErrorDisposer = reaction(() => this.props.userStore.loginError,
            (error) => {
                if (error) {
                    showLongToast("Please, check your username and password")
                }
            })
    }

//////////////////////////////////////////////////////////////////////////////////////////////
    Login = () => {
        if (this.handleVerifyLogin()) {
            this.props.userStore.tryLogin(this.state.email, this.state.password)
        }
    }

    Register = () => {
        if (this.handleVerifyRegister()) {

        }
    }
//////////////////////////////////////////////////////////////////////////////////////////////


    handleLogin = () => {
        this.setState({
            animationLogo_Form: 'zoomOut',
            animationButton_Form: 'bounceOutDown',
            animationLogo_Login: 'zoomIn',
            animationButton_Login: 'bounceInUp',
        })
        setTimeout(() => {
            this.setState({
                isLoginForm: 'login',
                password: '',
                errorPassword: '',
                confirm: '',
                errorConfirm: '',
                email: '',
                errorEmail: '',
                secureTextEntry: true,
            })
        }, 800);
    }

    handleRegister = () => {
        this.setState({
            animationLogo_Form: 'zoomOut',
            animationButton_Form: 'bounceOutDown',
            animationLogo_Login: 'zoomIn',
            animationButton_Login: 'bounceInUp',
        })
        setTimeout(() => {
            this.setState({
                isLoginForm: 'register',
                password: '',
                errorPassword: '',
                confirm: '',
                errorConfirm: '',
                email: '',
                errorEmail: '',
                secureTextEntry: true,
            })
        }, 800);
    }

    handleBack = () => {
        this.setState({
            animationLogo_Form: 'zoomIn',
            animationButton_Form: 'bounceInUp',
            animationLogo_Login: 'zoomOut',
            animationButton_Login: 'bounceOutDown',
        })
        setTimeout(() => {
            this.setState({
                isLoginForm: 'form',
                password: '',
                errorPassword: '',
                confirm: '',
                errorConfirm: '',
                email: '',
                errorEmail: '',
                secureTextEntry: true,
            })
        }, 800);
    }

    validate = (email) => {
        return !!email;
    }

    emailValidate = (email) => {
        if (email === '') {
            this.setState({errorEmail: 'Should not be empty'})
        } else if (!this.validate(email)) {
            this.setState({errorEmail: 'Incorrect email format'})
        } else {
            this.setState({errorEmail: ''})
        }
    }


    passwordValidate = (password) => {
        if (password.length < 6) {
            this.setState({errorPassword: 'Too short'})
        } else {
            this.setState({errorPassword: ''})
        }
        if (password === '') {
            this.setState({errorPassword: 'Should not be empty'})
        }
        if (password.length < 6) {
            this.setState({errorPassword: 'Too short'})
        } else {
            this.setState({errorPassword: ''})
        }
    }

    confirmValidate = (confirm) => {
        if (confirm === '') {
            this.setState({errorConfirm: 'Should not be empty'})
        }
        if (confirm !== this.state.password) {
            this.setState({errorConfirm: 'Should be like password'})
        } else {
            this.setState({errorConfirm: ''})
        }
    }

    handleVerifyLogin = () => {
        let flag = true;
        if (this.state.email === '') {
            this.setState({errorEmail: 'Should not be empty'})
            flag = false;
        } else if (!this.validate(this.state.email)) {
            this.setState({errorEmail: 'Incorrect email format'})
            flag = false;
        } else {
            this.setState({errorEmail: ''})
        }
        if (this.state.password.length < 6) {
            this.setState({errorPassword: 'Too short'})
            flag = false;
        } else {
            this.setState({errorPassword: ''})
        }
        if (this.state.password === '') {
            this.setState({errorPassword: 'Should not be empty'})
            flag = false;
        } else if (this.state.password.length < 6) {
            this.setState({errorPassword: 'Too short'})
            flag = false;
        } else {
            this.setState({errorPassword: ''})
        }

        return flag;
    }

    handleVerifyRegister = () => {
        let flag = true;
        if (this.state.email === '') {
            this.setState({errorEmail: 'Should not be empty'})
            flag = false;
        } else if (!this.validate(this.state.email)) {
            this.setState({errorEmail: 'Incorrect email format'})
            flag = false;
        } else {
            this.setState({errorEmail: ''})
        }
        if (this.state.password.length < 6) {
            this.setState({errorPassword: 'Too short'})
            flag = false;
        } else {
            this.setState({errorPassword: ''})
        }
        if (this.state.password === '') {
            this.setState({errorPassword: 'Should not be empty'})
            flag = false;
        } else if (this.state.password.length < 6) {
            this.setState({errorPassword: 'Too short'})
            flag = false;
        } else {
            this.setState({errorPassword: ''})
        }
        if (this.state.confirm === '') {
            this.setState({errorConfirm: 'Should not be empty'})
            flag = false;
        } else if (this.state.confirm !== this.state.password) {
            this.setState({errorConfirm: 'Should be like password'})
            flag = false;
        } else {
            this.setState({errorConfirm: ''})
        }

        return flag;
    }

    onAccessoryPress() {
        if (this.state.secureTextEntry) {
            this.setState({secureTextEntry: false});
        } else {
            this.setState({secureTextEntry: true});
        }

    }

    renderPasswordAccessory() {
        let {secureTextEntry} = this.state;

        let name = secureTextEntry ?
            'visibility' :
            'visibility-off';

        return (
            <MaterialIcon
                size={24}
                name={name}
                color={TextField.defaultProps.baseColor}
                onPress={this.onAccessoryPress}
                suppressHighlighting
            />
        );
    }

    renderEmailIcon() {
        return (
            <MaterialIcon
                size={24}
                name='email'
                color={TextField.defaultProps.baseColor}
                onPress={this.onAccessoryPress}
                suppressHighlighting
            />
        );
    }

    async selectOrg() {
        const selection = await new Promise((resolve) => {
            const title = 'Select organization';
            const message = this.props.userStore.selectedOrg === 'test' ? 'Selected: Test' : 'Selected: Production';
            const buttons = [
                { text: 'Cancel', onPress: () => resolve(null) },
                { text: 'Production', onPress: () => resolve('production') },
                { text: 'Test PBO', onPress: () => resolve('test') }        ];
            Alert.alert(title, message, buttons);
        })

        if (selection) {
            this.props.userStore.setIsLoggedIn(false)
            await saveString(AUTH_KEYS.SELECTED_ORG, selection)
            this.props.userStore.selectOrg(selection)
        }
    }

    renderLogin = (email, password, confirm, secureTextEntry) => {
        switch (this.state.isLoginForm) {
            case 'form':
                return (
                    <SafeAreaView>
                        <Text animation={this.state.animationLogo_Form} delay={ANIM_TIMINGS.delay_1}
                              duration={100}></Text>
                        <View style={styles.topContainer} animation={this.state.animationLogo_Form}
                              delay={ANIM_TIMINGS.delay_1} duration={400}>
                            <TouchableOpacity style={styles.logoContent}>
                                <Image source={require('../../Assets/logo.png')} style={styles.logoImage}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText} animation={this.state.animationLogo_Form}
                                  delay={this.state.delay_2} duration={400}>{ENV['LOGIN_APP_NAME']}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.textContent} animation={this.state.animationLogo_Form}
                                  delay={ANIM_TIMINGS.delay_3} duration={400}>Housekeeping to know if room is clean or
                                dirty and hit notification.</Text>
                        </View>
                        <View style={styles.loginContainer} animation={this.state.animationButton_Form}
                              delay={ANIM_TIMINGS.delay_4} duration={1000}>
                            <TouchableOpacity style={styles.loginButton} onPress={() => this.handleLogin()}>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.registerButton} onPress={() => this.handleRegister()}>
                                <Text style={styles.registerText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                );
                break;
            case 'login':
                return (
                    <SafeAreaView>
                        <View style={styles.backContainer_login} animation={this.state.animationLogo_Login}
                              delay={ANIM_TIMINGS.delay_login_4} duration={400}>
                            <TouchableOpacity onPress={() => this.handleBack()}>
                                <AntIcon name="arrowleft" size={30} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.loginForm_scrollContainer}>
                            <View style={styles.titleContainer_login} animation={this.state.animationLogo_Login}
                                  delay={this.state.delay_login_1} duration={400}>
                                <Text style={styles.titleText_login}>{ENV['LOGIN_APP_NAME']}</Text>
                                <View style={styles.logoContainer_login}
                                      animation={this.state.animationLogo_Login}
                                      delay={ANIM_TIMINGS.delay_login_3} duration={400}>
                                    <Image source={require('../../Assets/logo.png')}
                                           style={styles.logoImage_login}/>
                                </View>
                            </View>
                            <View style={styles.loginContainer_login}
                                  animation={this.state.animationButton_Login}
                                  delay={ANIM_TIMINGS.delay_login_2} duration={1000}>

                                <Text style={styles.subTitle_login}>Welcome back!</Text>

                                <View>
                                    <TouchableOpacity style={styles.itemContent_login}>
                                        <TextField
                                            label='Email Address'
                                            tintColor='#2196F3'
                                            keyboardType='email-address'
                                            value={email}
                                            error={this.state.errorEmail}
                                            renderAccessory={this.renderEmailIcon}
                                            onChangeText={(email) => {
                                                this.setState({email: email});
                                                this.emailValidate(email);
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemContent_login}>
                                        <TextField
                                            label='Password'
                                            tintColor='#2196F3'
                                            value={password}
                                            error={this.state.errorPassword}
                                            secureTextEntry={secureTextEntry}
                                            renderAccessory={this.renderPasswordAccessory}
                                            onChangeText={(password) => {
                                                this.setState({password: password});
                                                this.passwordValidate(password);
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.loginButtonContainer_login}>
                                    <TouchableOpacity style={styles.loginButton_login}
                                                      onPress={() => this.Login()}>
                                        <Text style={styles.loginText_login}>Login</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.forgotButton_login} onPress={() => this.selectOrg()}>
                                        <Text style={styles.forgotText_login}>Change organization</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.spacer}/>
                        </View>
                    </SafeAreaView>
                );
                break;
            case 'register':
                return (
                    <SafeAreaView>
                        <View style={styles.backContainer_login} animation={this.state.animationLogo_Login}
                              delay={ANIM_TIMINGS.delay_login_4} duration={400}>
                            <TouchableOpacity onPress={() => this.handleBack()}>
                                <AntIcon name="arrowleft" size={30} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={styles.loginForm_scrollContainer}>
                            <View style={styles.titleContainer_login} animation={this.state.animationLogo_Login}
                                  delay={this.state.delay_login_1} duration={400}>
                                <Text style={styles.titleText_login}>{ENV['LOGIN_APP_NAME']}</Text>
                                <View style={styles.logoContainer_login}
                                      animation={this.state.animationLogo_Login}
                                      delay={ANIM_TIMINGS.delay_login_3} duration={400}>
                                    <Image source={require('../../Assets/logo.png')}
                                           style={styles.logoImage_login}/>
                                </View>
                            </View>
                            <View style={styles.loginContainer_login} animation={this.state.animationButton_Login}
                                  delay={ANIM_TIMINGS.delay_login_2} duration={1000}>

                                <Text style={styles.subTitle_login}>Welcome back!</Text>

                                <View>
                                    <TouchableOpacity style={styles.itemContent_login}>
                                        <TextField
                                            label='Email Address'
                                            tintColor='#2196F3'
                                            keyboardType='email-address'
                                            value={email}
                                            error={this.state.errorEmail}
                                            renderAccessory={this.renderEmailIcon}
                                            onChangeText={(email) => {
                                                this.setState({email: email});
                                                this.emailValidate(email);
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemContent_login}>
                                        <TextField
                                            label='Password'
                                            tintColor='#2196F3'
                                            value={password}
                                            error={this.state.errorPassword}
                                            secureTextEntry={secureTextEntry}
                                            renderAccessory={this.renderPasswordAccessory}
                                            onChangeText={(password) => {
                                                this.setState({password: password});
                                                this.passwordValidate(password);
                                            }}
                                        />
                                        <TextField
                                            label='Confirm'
                                            tintColor='#2196F3'
                                            value={confirm}
                                            error={this.state.errorConfirm}
                                            secureTextEntry={secureTextEntry}
                                            renderAccessory={this.renderPasswordAccessory}
                                            onChangeText={(password) => {
                                                this.setState({confirm: password});
                                                this.confirmValidate(password);
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.loginButtonContainer_login}>
                                    <TouchableOpacity style={styles.loginButton_login}
                                                      onPress={() => this.Register()}>
                                        <Text style={styles.loginText_login}>Register</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.spacer}/>
                        </View>
                    </SafeAreaView>
                );
                break;
        }
    }


    render() {
        let {email, password, confirm, secureTextEntry} = this.state;

        return (
            <ImageBackground style={styles.container} source={require('../../Assets/back.png')}>
                <StatusBar barStyle="light-content" backgroundColor="#347fd5"/>
                {this.props.userStore.tryLogging ?
                    <ActivityIndicator style={styles.progress} size="large" color="white"/> :
                    this.renderLogin(email, password, confirm, secureTextEntry)
                }
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#2196F3',
    },
    progress: {
        flex: 1,
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContent: {
        backgroundColor: '#fff',
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    logoImage: {
        width: 200,
        height: 200,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 50,
        justifyContent: 'center',
    },
    titleText: {
        color: '#fff',
        fontSize: 42,
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 50,
        justifyContent: 'center',
    },
    textContent: {
        color: '#fff',
        fontSize: 16,
        marginHorizontal: 40,
        textAlign: 'center',
    },
    loginContainer: {
        height: 150,
        alignItems: 'stretch',
        marginBottom: 50,
    },
    loginButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    loginText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 1,
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backContainer_login: {
        marginTop: 8,
        paddingHorizontal: 20,
    },
    titleContainer_login: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 30,
        justifyContent: 'center',
    },
    titleText_login: {
        color: '#fff',
        fontSize: 42,
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: 'center',
    },
    logoContainer_login: {
        width: 140,
        height: 140,
        marginTop: 10,
        borderRadius: 70,
        backgroundColor: '#fff'
    },
    logoImage_login: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    loginForm_scrollContainer: {
        flex: 1,
        alignContent: "space-around",
    },
    spacer: {
        flex: 1,
    },
    loginContainer_login: {
        alignContent: "space-around",
        borderRadius: 5,
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    subTitle_login: {
        color: '#2196F3',
        fontSize: 34,
        textAlign: 'center',
    },
    itemContent_login: {
        marginHorizontal: 40,
    },
    loginButtonContainer_login: {
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    loginButton_login: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    loginText_login: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButton_login: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#2196F3',
        borderWidth: 1,
    },
    registerText_login: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotButton_login: {
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
        borderRadius: 5,
    },
    forgotText_login: {
        color: '#727272',
        fontSize: 16,
    },
});
