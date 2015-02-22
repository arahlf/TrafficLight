//
//  ViewController.m
//  TrafficLightRemote
//
//  Created by Alan Rahlf on 2/21/15.
//  Copyright (c) 2015 Alan Rahlf. All rights reserved.
//

#import "ViewController.h"
#import "AFNetworking.h"
#import "AppDelegate.h"

@interface ViewController () <UITableViewDataSource, UITableViewDelegate>

@property (strong, nonatomic) NSMutableArray *dataModel;

@property (weak, nonatomic) IBOutlet UITableView *tableView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    
    self.tableView.tableFooterView = [UIView new];
    
    self.dataModel = [[NSMutableArray alloc] init];
    
    [self.dataModel addObject:@[ @"Light Red", @{ @"light": @"on", @"lamp": @"red" } ]];
    [self.dataModel addObject:@[ @"Light Yellow", @{ @"light": @"on", @"lamp": @"yellow" } ]];
    [self.dataModel addObject:@[ @"Light Green", @{ @"light": @"on", @"lamp": @"green" } ]];
    [self.dataModel addObject:@[ @"Flash Red", @{ @"light": @"flashing", @"lamp": @"red" } ]];
    [self.dataModel addObject:@[ @"Flash Yellow", @{ @"light": @"flashing", @"lamp": @"yellow" } ]];
    [self.dataModel addObject:@[ @"Flash Green", @{ @"light": @"flashing", @"lamp": @"green" } ]];
    [self.dataModel addObject:@[ @"Lights Off", @{ @"light": @"off" } ]];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.dataModel count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [self.tableView dequeueReusableCellWithIdentifier:@"commandCell"];
    
    NSArray *commandObject = self.dataModel[indexPath.row];
    
    cell.textLabel.text = commandObject[0];
    cell.selectionStyle = UITableViewCellSelectionStyleBlue;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    NSDictionary *parameters = self.dataModel[indexPath.row][1];
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    
    [manager PUT:API_URL parameters:parameters success:nil failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        NSLog(@"Request error: %@", error);
    }];
}

@end
