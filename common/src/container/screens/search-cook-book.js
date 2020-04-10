import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../views/header';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import CookBookInfoInput, {
  CookBookInfoPickerInput
} from '../../views/search-cook-book/cook-book-info-input';
import { disposeOnUnmount, inject, observer } from 'mobx-react';
import { Button, CheckBox } from 'react-native-elements';
import { observable, action, reaction } from 'mobx';
import SearchCookBookVM from '../../view-models/search-cook-book';
import Snackbar from 'react-native-snackbar';
import CookBookInfo from '../../views/search-cook-book/cook-book-info';
import FlatAlert from '../../views/flat-alert';
import { Actions } from 'react-native-router-flux';

@inject('userStore', 'salesforceApi')
@observer
export default class SearchCookBook extends Component {
  viewModel = new SearchCookBookVM(
    this.props.userStore,
    this.props.salesforceApi
  );

  @observable
  isShowSnackbar = false;
  @disposeOnUnmount
  isShowSnackbarDisposer = reaction(
    () => this.isShowSnackbar,
    isShowSnackbar => {
      if (isShowSnackbar) {
        Snackbar.show({
          title: 'Failed to get Cook Book list',
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: 'RETRY',
            color: '#2196F3',
            onPress: this.requestCookBooks
          }
        });
      } else {
        Snackbar.dismiss();
      }
    }
  );
  @disposeOnUnmount
  getCookBookListErrorDisposer = reaction(
    () => this.viewModel.cookBooksRequest.error,
    error => {
      if (
        error &&
        this.viewModel.cookBooksRequest.data &&
        this.viewModel.cookBooksRequest.data.length > 0
      ) {
        this.setIsShowSnackbar(true);
      }
    }
  );

  @action
  setIsShowSnackbar(isShowSnackbar) {
    this.isShowSnackbar = isShowSnackbar;
  }

  refreshCookBooks = () => {
    this.requestCookBooks(true);
  };

  requestCookBooks = (withRefreshing = false) => {
    if (
      this.viewModel.cookBooksRequest.isFetching ||
      (!withRefreshing && !this.viewModel.cookBooksRequest.canLoadNext)
    )
      return;

    this.setIsShowSnackbar(false);

    this.viewModel.requestCookBooks(withRefreshing);
  };

  renderCookBook = ({ item }) => (
    <TouchableOpacity
      onPress={() => Actions.CookBookReportDetail({ cookBook: item })}
    >
      <CookBookInfo containerStyle={styles.cookBookItem} cookBook={item} />
    </TouchableOpacity>
  );

  renderSeeMoreButton = () => (
    <Button
      containerStyle={styles.seeMoreButtonContainer}
      buttonStyle={styles.seeMoreButton}
      title='See more'
      type='outline'
      onPress={this.requestCookBooks}
      loading={this.viewModel.cookBooksRequest}
      disabled={this.isShowSnackbar}
    />
  );

  FilterHasPhone = observer(() => (
    <CheckBox
      containerStyle={styles.filterHasPhone}
      checked={this.viewModel.filterHasPhone}
      onPress={this.viewModel.switchFilterHasPhone}
    />
  ));

  *renderViews() {
    const {
      isFetching,
      canLoadNext,
      data,
      error
    } = this.viewModel.cookBooksRequest;
    const isEmpty = !data || data.length === 0;

    yield (<Header title='Cook book report' withBack />);

    // if (this.viewModel.filterInfoRequest.data) {
    //   yield (
    //     <CookBookInfoInput
    //       title='Account Executives:'
    //       onSelect={this.viewModel.changeAccountExecutive}
    //       options={
    //         this.viewModel.filterAccountExecutiveData &&
    //         this.viewModel.filterAccountExecutiveData.map(
    //           ({ Email__c }) => Email__c
    //         )
    //       }
    //     />
    //   );

    //   yield (
    //     <CookBookInfoPickerInput
    //       title='Start Date:'
    //       selectedDate={this.viewModel.filterStartDate}
    //       onSelect={this.viewModel.changeStartDate}
    //       maximumDate={this.viewModel.filterEndDate}
    //     />
    //   );

    //   yield (
    //     <CookBookInfoPickerInput
    //       title='End Date:'
    //       selectedDate={this.viewModel.filterEndDate}
    //       onSelect={this.viewModel.changeEndDate}
    //       minimumDate={this.viewModel.filterStartDate}
    //     />
    //   );

    //   yield (
    //     <CookBookInfoInput
    //       title='Interest level:'
    //       onSelect={this.viewModel.changeInterestLevel}
    //       options={this.props.salesforceApi.INTEREST_LEVELS}
    //     />
    //   );

    //   yield (
    //     <CookBookInfoInput
    //       title='Call result:'
    //       onSelect={this.viewModel.changeCallResultType}
    //       options={Object.keys(this.props.salesforceApi.CALL_RESULT_TYPES).map(
    //         key => this.props.salesforceApi.CALL_RESULT_TYPES[key]
    //       )}
    //     />
    //   );

    //   yield (
    //     <CookBookInfoInput
    //       title='Has Phone?:'
    //       input={<this.FilterHasPhone />}
    //     />
    //   );
    // } else if (this.viewModel.filterInfoRequest.isFetching) {
    //   yield (
    //     <ActivityIndicator
    //       style={styles.progress}
    //       size='large'
    //       color='#2196F3'
    //     />
    //   );
    // } else {
    //   yield (
    //     <FlatAlert
    //       onRetryPress={this.viewModel.requestFilterInfo}
    //       message={this.viewModel.filterInfoRequest.error.message}
    //     />
    //   );
    // }

    if (!isEmpty) {
      // yield (
      //   <Button
      //     containerStyle={styles.searchButtonContainer}
      //     buttonStyle={styles.searchButton}
      //     title='Search'
      //     onPress={this.refreshCookBooks}
      //     loading={isFetching}
      //     disabled={!this.viewModel.isFilterChange}
      //   />
      // );

      yield (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={this.renderCookBook}
          ListFooterComponent={
            canLoadNext ? this.renderSeeMoreButton : undefined
          }
        />
      );

      yield (
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.button}>
            <Icon name='md-funnel' color='#ffffff' size={24} />
          </TouchableOpacity>
        </View>
      );
    } else if (isFetching) {
      yield (
        <ActivityIndicator
          style={styles.progress}
          size='large'
          color='#2196F3'
        />
      );
    } else {
      yield (
        <FlatAlert
          onRetryPress={this.requestCookBooks}
          message={error ? error.message : 'Cook Book list is empty'}
        />
      );
    }
  }

  render() {
    return <View style={styles.container}>{[...this.renderViews()]}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#fff'
  },
  searchButtonContainer: {
    marginHorizontal: '20%'
  },
  searchButton: {
    borderRadius: 100,
    backgroundColor: '#2196F3'
  },
  searchButtonTitle: {
    color: 'white'
  },
  seeMoreButtonContainer: {
    marginHorizontal: '20%'
  },
  seeMoreButton: {
    borderRadius: 100,
    backgroundColor: '#2196F3'
  },
  progress: {
    flex: 1
  },
  cookBookItem: {
    marginHorizontal: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4
  },
  filterHasPhone: {
    margin: 0,
    padding: 0
  },
  button: {
    position: 'absolute',
    bottom: 10,
    right: 16,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#0883ED',
    borderRadius: 50
  }
});
